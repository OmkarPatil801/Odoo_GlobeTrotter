const AppError = require('../utils/appError');
const HTTP_STATUS = require('../utils/httpStatus');
const { logSecurityEvent } = require('../utils/securityLogger');

function tripNotFoundError() {
  return new AppError('Trip not found', HTTP_STATUS.NOT_FOUND, 'TRIP_NOT_FOUND');
}

function stopNotFoundError() {
  return new AppError('Trip stop not found', HTTP_STATUS.NOT_FOUND, 'TRIP_STOP_NOT_FOUND');
}

function cityNotFoundError() {
  return new AppError('City not found', HTTP_STATUS.NOT_FOUND, 'CITY_NOT_FOUND');
}

function assertValidDateRange(arrivalDate, departureDate) {
  if (arrivalDate && departureDate && departureDate < arrivalDate) {
    throw AppError.unprocessable('departureDate must be on or after arrivalDate', [
      { field: 'departureDate', message: 'departureDate must be on or after arrivalDate' },
    ]);
  }
}

// Factory so the service can be wired to any repository implementations
// satisfying the TripRepository/TripStopRepository/CityRepository
// contracts. Trip stops are always accessed through their parent trip,
// so this depends on tripRepository too — purely to verify ownership,
// never to duplicate trip business logic (see tripService.js for that).
function createTripStopService({ tripRepository, tripStopRepository, cityRepository }) {
  async function assertTripOwnership(tripId, userId) {
    const trip = await tripRepository.findTripById(tripId);
    if (!trip || trip.userId !== userId) {
      logSecurityEvent('AUTHORIZATION_FAILURE', { resource: 'trip', tripId, userId });
      throw tripNotFoundError();
    }
    return trip;
  }

  async function assertCityExists(cityId) {
    const city = await cityRepository.findCityById(cityId);
    if (!city) throw cityNotFoundError();
  }

  // Verifies trip ownership AND that the stop actually belongs to that
  // trip (a stop id from a different trip must 404, not leak into scope).
  async function getOwnedStop(tripId, stopId, userId) {
    await assertTripOwnership(tripId, userId);

    const stop = await tripStopRepository.findStopById(stopId);
    if (!stop || stop.tripId !== tripId) {
      logSecurityEvent('AUTHORIZATION_FAILURE', { resource: 'tripStop', tripId, stopId, userId });
      throw stopNotFoundError();
    }
    return stop;
  }

  async function listStops(tripId, userId) {
    await assertTripOwnership(tripId, userId);
    const stops = await tripStopRepository.listStopsByTrip(tripId);

    // Attach a light city summary per stop — reuses the existing City
    // shape rather than inventing a new DTO.
    const cities = await Promise.all(stops.map((stop) => cityRepository.findCityById(stop.cityId)));
    return stops.map((stop, index) => ({
      ...stop,
      city: cities[index]
        ? {
            id: cities[index].id,
            name: cities[index].name,
            countryCode: cities[index].countryCode,
            imageUrl: cities[index].imageUrl,
          }
        : null,
    }));
  }

  async function createStop(tripId, userId, data) {
    await assertTripOwnership(tripId, userId);
    assertValidDateRange(data.arrivalDate, data.departureDate);
    await assertCityExists(data.cityId);

    return tripStopRepository.createStop(tripId, {
      cityId: data.cityId,
      stopOrder: data.stopOrder,
      arrivalDate: data.arrivalDate !== undefined ? data.arrivalDate : null,
      departureDate: data.departureDate !== undefined ? data.departureDate : null,
      notes: data.notes !== undefined ? data.notes : null,
    });
  }

  async function updateStop(tripId, stopId, userId, updates) {
    const existingStop = await getOwnedStop(tripId, stopId, userId);

    const mergedArrivalDate = updates.arrivalDate !== undefined ? updates.arrivalDate : existingStop.arrivalDate;
    const mergedDepartureDate =
      updates.departureDate !== undefined ? updates.departureDate : existingStop.departureDate;
    assertValidDateRange(mergedArrivalDate, mergedDepartureDate);

    if (updates.cityId !== undefined) {
      await assertCityExists(updates.cityId);
    }

    const changes = {};
    if (updates.cityId !== undefined) changes.cityId = updates.cityId;
    if (updates.stopOrder !== undefined) changes.stopOrder = updates.stopOrder;
    if (updates.arrivalDate !== undefined) changes.arrivalDate = updates.arrivalDate;
    if (updates.departureDate !== undefined) changes.departureDate = updates.departureDate;
    if (updates.notes !== undefined) changes.notes = updates.notes;

    return tripStopRepository.updateStop(stopId, changes);
  }

  async function deleteStop(tripId, stopId, userId) {
    await getOwnedStop(tripId, stopId, userId);
    await tripStopRepository.deleteStop(stopId);
  }

  async function reorderStops(tripId, userId, stopIds) {
    await assertTripOwnership(tripId, userId);

    const uniqueRequested = new Set(stopIds);
    if (uniqueRequested.size !== stopIds.length) {
      throw AppError.unprocessable('stopIds must not contain duplicate ids', [
        { field: 'stopIds', message: 'stopIds must not contain duplicate ids' },
      ]);
    }

    const existingStops = await tripStopRepository.listStopsByTrip(tripId);
    const existingIds = existingStops.map((stop) => stop.id);

    // Requested set must be exactly the trip's existing stops — this one
    // check simultaneously rejects a missing id, an extra id, and an id
    // belonging to a different trip (since existingIds only ever contains
    // this trip's stops).
    const isExactMatch =
      existingIds.length === uniqueRequested.size && existingIds.every((id) => uniqueRequested.has(id));

    if (!isExactMatch) {
      throw AppError.unprocessable("stopIds must exactly match the trip's existing stop ids", [
        { field: 'stopIds', message: "stopIds must exactly match the trip's existing stop ids, each exactly once" },
      ]);
    }

    return tripStopRepository.reorderStops(tripId, stopIds);
  }

  return { listStops, createStop, getOwnedStop, updateStop, deleteStop, reorderStops };
}

module.exports = createTripStopService;

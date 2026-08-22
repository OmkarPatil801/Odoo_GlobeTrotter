const AppError = require('../utils/appError');
const HTTP_STATUS = require('../utils/httpStatus');
const { normalizePagination, buildPaginationMeta } = require('../utils/pagination');
const { logSecurityEvent } = require('../utils/securityLogger');

function tripNotFoundError() {
  // Also used when a trip exists but belongs to another user — the API
  // must never reveal that a trip id exists if the caller doesn't own it.
  return new AppError('Trip not found', HTTP_STATUS.NOT_FOUND, 'TRIP_NOT_FOUND');
}

function assertValidDateRange(startDate, endDate) {
  if (startDate && endDate && endDate < startDate) {
    throw AppError.unprocessable('endDate must be on or after startDate', [
      { field: 'endDate', message: 'endDate must be on or after startDate' },
    ]);
  }
}

// Factory so the service can be wired to any repository implementation
// that satisfies the TripRepository contract
// (see src/repositories/contracts/tripRepository.contract.js).
function createTripService(tripRepository) {
  async function createTrip(userId, data) {
    assertValidDateRange(data.startDate, data.endDate);

    return tripRepository.createTrip(userId, {
      name: data.name.trim(),
      description: data.description !== undefined ? data.description : null,
      startDate: data.startDate,
      endDate: data.endDate,
      coverImageUrl: data.coverImageUrl !== undefined ? data.coverImageUrl : null,
    });
  }

  async function listMyTrips(userId, { status, page, limit }) {
    const normalized = normalizePagination({ page, limit });

    const { items, total } = await tripRepository.listTripsByUser(userId, {
      status,
      page: normalized.page,
      limit: normalized.limit,
    });

    return { items, meta: buildPaginationMeta({ ...normalized, total }) };
  }

  // Fetches a trip and verifies the authenticated user owns it. Used
  // directly by GET /:id, and by every other trip/trip-stop operation to
  // enforce ownership before mutating anything.
  async function getOwnedTrip(id, userId) {
    const trip = await tripRepository.findTripById(id);
    if (!trip || trip.userId !== userId) {
      // Same log for "doesn't exist" and "exists but isn't yours" — the
      // point of this event is to notice someone probing trip ids, not
      // to distinguish the two cases (the API response already doesn't).
      logSecurityEvent('AUTHORIZATION_FAILURE', { resource: 'trip', tripId: id, userId });
      throw tripNotFoundError();
    }
    return trip;
  }

  async function updateTrip(id, userId, updates) {
    const existingTrip = await getOwnedTrip(id, userId);

    // A partial update might only touch one of the two dates — re-check
    // the full range against whichever value (new or existing) applies.
    const mergedStartDate = updates.startDate !== undefined ? updates.startDate : existingTrip.startDate;
    const mergedEndDate = updates.endDate !== undefined ? updates.endDate : existingTrip.endDate;
    assertValidDateRange(mergedStartDate, mergedEndDate);

    const changes = {};
    if (updates.name !== undefined) changes.name = updates.name.trim();
    if (updates.description !== undefined) changes.description = updates.description;
    if (updates.startDate !== undefined) changes.startDate = updates.startDate;
    if (updates.endDate !== undefined) changes.endDate = updates.endDate;
    if (updates.coverImageUrl !== undefined) changes.coverImageUrl = updates.coverImageUrl;
    if (updates.status !== undefined) changes.status = updates.status;
    if (updates.isPublic !== undefined) changes.isPublic = updates.isPublic;

    return tripRepository.updateTrip(id, changes);
  }

  async function deleteTrip(id, userId) {
    await getOwnedTrip(id, userId);
    await tripRepository.deleteTrip(id);
  }

  return { createTrip, listMyTrips, getOwnedTrip, updateTrip, deleteTrip };
}

module.exports = createTripService;

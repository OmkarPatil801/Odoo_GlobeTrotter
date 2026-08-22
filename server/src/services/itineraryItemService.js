const AppError = require('../utils/appError');
const HTTP_STATUS = require('../utils/httpStatus');

function tripNotFoundError() {
  return new AppError('Trip not found', HTTP_STATUS.NOT_FOUND, 'TRIP_NOT_FOUND');
}

function itemNotFoundError() {
  return new AppError('Itinerary item not found', HTTP_STATUS.NOT_FOUND, 'ITINERARY_ITEM_NOT_FOUND');
}

function cityNotFoundError() {
  return new AppError('City not found', HTTP_STATUS.NOT_FOUND, 'CITY_NOT_FOUND');
}

function activityNotFoundError() {
  return new AppError('Activity not found', HTTP_STATUS.NOT_FOUND, 'ACTIVITY_NOT_FOUND');
}

function assertValidTimeRange(startTime, endTime) {
  if (startTime && endTime && endTime < startTime) {
    throw AppError.unprocessable('endTime must be on or after startTime', [
      { field: 'endTime', message: 'endTime must be on or after startTime' },
    ]);
  }
}

// Factory so the service can be wired to any repository implementations
// satisfying the Trip/ItineraryItem/City/Activity repository contracts.
// Itinerary items are always accessed through their parent trip, so this
// depends on tripRepository too — purely to verify ownership.
function createItineraryItemService({ tripRepository, itineraryItemRepository, cityRepository, activityRepository }) {
  async function assertTripOwnership(tripId, userId) {
    const trip = await tripRepository.findTripById(tripId);
    if (!trip || trip.userId !== userId) {
      throw tripNotFoundError();
    }
    return trip;
  }

  async function assertCityExists(cityId) {
    const city = await cityRepository.findCityById(cityId);
    if (!city) throw cityNotFoundError();
  }

  async function assertActivityExists(activityId) {
    if (activityId === null || activityId === undefined) return;
    const activity = await activityRepository.findActivityById(activityId);
    if (!activity) throw activityNotFoundError();
  }

  // Verifies trip ownership AND that the item actually belongs to that
  // trip (an item id from a different trip must 404, not leak into scope).
  async function getOwnedItem(tripId, itemId, userId) {
    await assertTripOwnership(tripId, userId);

    const item = await itineraryItemRepository.findItemById(itemId);
    if (!item || item.tripId !== tripId) {
      throw itemNotFoundError();
    }
    return item;
  }

  async function listItems(tripId, userId, filters) {
    await assertTripOwnership(tripId, userId);
    return itineraryItemRepository.listItemsByTrip(tripId, filters);
  }

  async function createItem(tripId, userId, data) {
    await assertTripOwnership(tripId, userId);
    assertValidTimeRange(data.startTime, data.endTime);
    await assertCityExists(data.cityId);
    await assertActivityExists(data.activityId);

    return itineraryItemRepository.createItem(tripId, {
      cityId: data.cityId,
      activityId: data.activityId !== undefined ? data.activityId : null,
      activityDate: data.activityDate,
      startTime: data.startTime !== undefined ? data.startTime : null,
      endTime: data.endTime !== undefined ? data.endTime : null,
      itemOrder: data.itemOrder,
      notes: data.notes !== undefined ? data.notes : null,
    });
  }

  async function updateItem(tripId, itemId, userId, updates) {
    const existingItem = await getOwnedItem(tripId, itemId, userId);

    const mergedStartTime = updates.startTime !== undefined ? updates.startTime : existingItem.startTime;
    const mergedEndTime = updates.endTime !== undefined ? updates.endTime : existingItem.endTime;
    assertValidTimeRange(mergedStartTime, mergedEndTime);

    if (updates.cityId !== undefined) await assertCityExists(updates.cityId);
    if (updates.activityId !== undefined) await assertActivityExists(updates.activityId);

    const changes = {};
    ['cityId', 'activityId', 'activityDate', 'startTime', 'endTime', 'itemOrder', 'notes'].forEach((field) => {
      if (updates[field] !== undefined) changes[field] = updates[field];
    });

    return itineraryItemRepository.updateItem(itemId, changes);
  }

  async function deleteItem(tripId, itemId, userId) {
    await getOwnedItem(tripId, itemId, userId);
    await itineraryItemRepository.deleteItem(itemId);
  }

  async function reorderItems(tripId, userId, activityDate, itemIds) {
    await assertTripOwnership(tripId, userId);

    const uniqueRequested = new Set(itemIds);
    if (uniqueRequested.size !== itemIds.length) {
      throw AppError.unprocessable('itemIds must not contain duplicate ids', [
        { field: 'itemIds', message: 'itemIds must not contain duplicate ids' },
      ]);
    }

    const existingItems = await itineraryItemRepository.listItemsByTrip(tripId, { activityDate });
    const existingIds = existingItems.map((item) => item.id);

    const isExactMatch =
      existingIds.length === uniqueRequested.size && existingIds.every((id) => uniqueRequested.has(id));

    if (!isExactMatch) {
      throw AppError.unprocessable("itemIds must exactly match that day's existing item ids", [
        { field: 'itemIds', message: "itemIds must exactly match that day's existing item ids, each exactly once" },
      ]);
    }

    return itineraryItemRepository.reorderItems(tripId, activityDate, itemIds);
  }

  return { listItems, createItem, getOwnedItem, updateItem, deleteItem, reorderItems };
}

module.exports = createItineraryItemService;

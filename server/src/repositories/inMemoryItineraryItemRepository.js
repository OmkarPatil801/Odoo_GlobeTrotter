// In-memory implementation of the ItineraryItemRepository contract
// (see ./contracts/itineraryItemRepository.contract.js). Used until the
// database teammate's real implementation is wired in for local dev
// without a DATABASE_URL, and directly by tests.
function createInMemoryItineraryItemRepository() {
  const itemsById = new Map();
  let nextId = 1;

  function toApiItem(row) {
    return {
      ...row,
      id: String(row.id),
      tripId: String(row.tripId),
      cityId: String(row.cityId),
      activityId: row.activityId !== null ? String(row.activityId) : null,
    };
  }

  async function listItemsByTrip(tripId, filters = {}) {
    const numericTripId = Number(tripId);
    if (!Number.isInteger(numericTripId)) return [];

    let rows = Array.from(itemsById.values()).filter((item) => item.tripId === numericTripId);
    if (filters.activityDate) {
      rows = rows.filter((item) => item.activityDate === filters.activityDate);
    }

    rows.sort((a, b) => a.activityDate.localeCompare(b.activityDate) || a.itemOrder - b.itemOrder);
    return rows.map(toApiItem);
  }

  async function findItemById(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const row = itemsById.get(numericId);
    return row ? toApiItem(row) : null;
  }

  async function createItem(tripId, data) {
    const numericId = nextId;
    nextId += 1;
    const now = new Date().toISOString();

    const row = {
      id: numericId,
      tripId: Number(tripId),
      cityId: Number(data.cityId),
      activityId: data.activityId !== undefined && data.activityId !== null ? Number(data.activityId) : null,
      activityDate: data.activityDate,
      startTime: data.startTime !== undefined ? data.startTime : null,
      endTime: data.endTime !== undefined ? data.endTime : null,
      itemOrder: data.itemOrder,
      notes: data.notes !== undefined ? data.notes : null,
      createdAt: now,
      updatedAt: now,
    };
    itemsById.set(numericId, row);
    return toApiItem(row);
  }

  async function updateItem(id, data) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const existing = itemsById.get(numericId);
    if (!existing) return null;

    const changes = { ...data };
    if (changes.cityId !== undefined) changes.cityId = Number(changes.cityId);
    if ('activityId' in changes) {
      changes.activityId = changes.activityId !== null ? Number(changes.activityId) : null;
    }

    const updated = { ...existing, ...changes, updatedAt: new Date().toISOString() };
    itemsById.set(numericId, updated);
    return toApiItem(updated);
  }

  async function deleteItem(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return;
    itemsById.delete(numericId);
  }

  async function reorderItems(tripId, activityDate, orderedItemIds) {
    const now = new Date().toISOString();

    orderedItemIds.forEach((itemId, index) => {
      const numericId = Number(itemId);
      const existing = itemsById.get(numericId);
      if (existing) {
        itemsById.set(numericId, { ...existing, itemOrder: index + 1, updatedAt: now });
      }
    });

    return listItemsByTrip(tripId, { activityDate });
  }

  return { listItemsByTrip, findItemById, createItem, updateItem, deleteItem, reorderItems };
}

module.exports = createInMemoryItineraryItemRepository;

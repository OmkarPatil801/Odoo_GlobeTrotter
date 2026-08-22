// In-memory implementation of the TripStopRepository contract
// (see ./contracts/tripStopRepository.contract.js). Used until the
// database teammate's real implementation is wired in for local dev
// without a DATABASE_URL, and directly by tests.
//
// Same string-id <-> numeric-id convention as inMemoryTripRepository.js.
// There's no real uniqueness constraint to worry about here (it's a
// plain Map, not MySQL) — reorderStops just reassigns stopOrder directly.
function createInMemoryTripStopRepository() {
  const stopsById = new Map();
  let nextId = 1;

  function toApiStop(row) {
    return { ...row, id: String(row.id), tripId: String(row.tripId), cityId: String(row.cityId) };
  }

  async function listStopsByTrip(tripId) {
    const numericTripId = Number(tripId);
    if (!Number.isInteger(numericTripId)) return [];

    const rows = Array.from(stopsById.values())
      .filter((stop) => stop.tripId === numericTripId)
      .sort((a, b) => a.stopOrder - b.stopOrder);

    return rows.map(toApiStop);
  }

  async function findStopById(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const row = stopsById.get(numericId);
    return row ? toApiStop(row) : null;
  }

  async function createStop(tripId, data) {
    const numericId = nextId;
    nextId += 1;
    const now = new Date().toISOString();

    const row = {
      id: numericId,
      tripId: Number(tripId),
      cityId: Number(data.cityId),
      stopOrder: data.stopOrder,
      arrivalDate: data.arrivalDate !== undefined ? data.arrivalDate : null,
      departureDate: data.departureDate !== undefined ? data.departureDate : null,
      notes: data.notes !== undefined ? data.notes : null,
      createdAt: now,
      updatedAt: now,
    };
    stopsById.set(numericId, row);
    return toApiStop(row);
  }

  async function updateStop(id, data) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const existing = stopsById.get(numericId);
    if (!existing) return null;

    const changes = { ...data };
    if (changes.cityId !== undefined) changes.cityId = Number(changes.cityId);

    const updated = { ...existing, ...changes, updatedAt: new Date().toISOString() };
    stopsById.set(numericId, updated);
    return toApiStop(updated);
  }

  async function deleteStop(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return;
    stopsById.delete(numericId);
  }

  async function reorderStops(tripId, orderedStopIds) {
    const numericTripId = Number(tripId);
    const now = new Date().toISOString();

    orderedStopIds.forEach((stopId, index) => {
      const numericId = Number(stopId);
      const existing = stopsById.get(numericId);
      if (existing && existing.tripId === numericTripId) {
        stopsById.set(numericId, { ...existing, stopOrder: index + 1, updatedAt: now });
      }
    });

    return listStopsByTrip(tripId);
  }

  return { listStopsByTrip, findStopById, createStop, updateStop, deleteStop, reorderStops };
}

module.exports = createInMemoryTripStopRepository;

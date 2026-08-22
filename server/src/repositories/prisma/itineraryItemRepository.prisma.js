// See tripStopRepository.prisma.js for the same UTC-midnight Date <->
// "YYYY-MM-DD" convention applied to `activityDate`.
function toDateOnly(date) {
  if (!date) return null;
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toDbDate(dateOnlyString) {
  if (dateOnlyString === undefined || dateOnlyString === null) return dateOnlyString;
  return new Date(`${dateOnlyString}T00:00:00.000Z`);
}

// The DB column is `@db.Time`, which Prisma represents as a JS Date
// carrying an arbitrary (epoch) date part — only the UTC hours/minutes
// are meaningful. Convert to/from a plain "HH:MM" string at this
// boundary so nothing above this layer ever sees the epoch date part.
function toApiTime(date) {
  if (!date) return null;
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function toDbTime(hhmm) {
  if (hhmm === undefined || hhmm === null) return hhmm;
  return new Date(`1970-01-01T${hhmm}:00.000Z`);
}

function toApiItem(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    tripId: String(row.tripId),
    cityId: String(row.cityId),
    activityId: row.activityId !== null ? String(row.activityId) : null,
    activityDate: toDateOnly(row.activityDate),
    startTime: toApiTime(row.startTime),
    endTime: toApiTime(row.endTime),
    itemOrder: row.itemOrder,
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

// Prisma-backed implementation of the ItineraryItemRepository contract
// (see ../contracts/itineraryItemRepository.contract.js).
//
// `prisma` defaults to the shared client, resolved lazily — see
// userRepository.prisma.js for why.
function createPrismaItineraryItemRepository(prisma) {
  const client = prisma || require('../../config/prismaClient');

  async function listItemsByTrip(tripId, filters = {}) {
    const numericTripId = Number(tripId);
    if (!Number.isInteger(numericTripId)) return [];

    const where = { tripId: numericTripId };
    if (filters.activityDate) where.activityDate = toDbDate(filters.activityDate);

    const rows = await client.itineraryItem.findMany({
      where,
      orderBy: [{ activityDate: 'asc' }, { itemOrder: 'asc' }],
    });
    return rows.map(toApiItem);
  }

  async function findItemById(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const row = await client.itineraryItem.findUnique({ where: { id: numericId } });
    return toApiItem(row);
  }

  async function createItem(tripId, data) {
    const row = await client.itineraryItem.create({
      data: {
        tripId: Number(tripId),
        cityId: Number(data.cityId),
        activityId: data.activityId !== undefined && data.activityId !== null ? Number(data.activityId) : null,
        activityDate: toDbDate(data.activityDate),
        startTime: toDbTime(data.startTime !== undefined ? data.startTime : null),
        endTime: toDbTime(data.endTime !== undefined ? data.endTime : null),
        itemOrder: data.itemOrder,
        notes: data.notes !== undefined ? data.notes : null,
      },
    });
    return toApiItem(row);
  }

  async function updateItem(id, data) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const changes = { ...data };
    if (changes.cityId !== undefined) changes.cityId = Number(changes.cityId);
    if ('activityId' in changes) {
      changes.activityId = changes.activityId !== null ? Number(changes.activityId) : null;
    }
    if ('activityDate' in changes) changes.activityDate = toDbDate(changes.activityDate);
    if ('startTime' in changes) changes.startTime = toDbTime(changes.startTime);
    if ('endTime' in changes) changes.endTime = toDbTime(changes.endTime);

    try {
      const row = await client.itineraryItem.update({ where: { id: numericId }, data: changes });
      return toApiItem(row);
    } catch (err) {
      if (err.code === 'P2025') return null;
      throw err;
    }
  }

  async function deleteItem(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return;

    try {
      await client.itineraryItem.delete({ where: { id: numericId } });
    } catch (err) {
      if (err.code === 'P2025') return; // already gone — idempotent
      throw err;
    }
  }

  // No uniqueness constraint on (tripId, activityDate, itemOrder), so
  // (unlike trip_stops) a direct sequence of updates to the final order
  // can never collide — no transaction/two-phase dance needed.
  async function reorderItems(tripId, activityDate, orderedItemIds) {
    const numericTripId = Number(tripId);
    const numericIds = orderedItemIds.map((id) => Number(id));

    await client.$transaction(
      numericIds.map((id, index) => client.itineraryItem.update({ where: { id }, data: { itemOrder: index + 1 } }))
    );

    const rows = await client.itineraryItem.findMany({
      where: { tripId: numericTripId, activityDate: toDbDate(activityDate) },
      orderBy: { itemOrder: 'asc' },
    });
    return rows.map(toApiItem);
  }

  return { listItemsByTrip, findItemById, createItem, updateItem, deleteItem, reorderItems };
}

module.exports = createPrismaItineraryItemRepository;

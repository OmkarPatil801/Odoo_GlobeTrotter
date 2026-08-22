// Prisma's `@db.Date` columns come back as JS Date objects at UTC
// midnight. Format using the UTC getters (never local-timezone getters)
// so the calendar date is preserved regardless of server timezone — trip
// dates are calendar dates, not instants, and must never be silently
// shifted into a single global timezone.
function toDateOnly(date) {
  if (!date) return null;
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Inverse of toDateOnly — a "YYYY-MM-DD" string in, a UTC-midnight Date
// for Prisma out. Passes `undefined`/`null` through unchanged so a
// partial update's `data` object doesn't accidentally clear a field that
// wasn't supplied.
function toDbDate(dateOnlyString) {
  if (dateOnlyString === undefined || dateOnlyString === null) return dateOnlyString;
  return new Date(`${dateOnlyString}T00:00:00.000Z`);
}

function toApiTrip(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    userId: String(row.userId),
    name: row.name,
    description: row.description,
    startDate: toDateOnly(row.startDate),
    endDate: toDateOnly(row.endDate),
    coverImageUrl: row.coverImageUrl,
    status: row.status,
    isPublic: row.isPublic,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

// Prisma-backed implementation of the TripRepository contract
// (see ../contracts/tripRepository.contract.js).
//
// `prisma` defaults to the shared client, resolved lazily — see
// userRepository.prisma.js for why.
function createPrismaTripRepository(prisma) {
  const client = prisma || require('../../config/prismaClient');

  async function findTripById(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const row = await client.trip.findUnique({ where: { id: numericId } });
    return toApiTrip(row);
  }

  async function listTripsByUser(userId, filters = {}) {
    const numericUserId = Number(userId);
    const { status, page, limit } = filters;
    const hasPagination = Boolean(page && limit);

    const where = { userId: numericUserId, ...(status ? { status } : {}) };

    const [rows, total] = await Promise.all([
      client.trip.findMany({
        where,
        skip: hasPagination ? (page - 1) * limit : undefined,
        take: hasPagination ? limit : undefined,
        orderBy: { createdAt: 'desc' },
      }),
      client.trip.count({ where }),
    ]);

    return { items: rows.map(toApiTrip), total };
  }

  async function createTrip(userId, data) {
    const row = await client.trip.create({
      data: {
        userId: Number(userId),
        name: data.name,
        description: data.description !== undefined ? data.description : null,
        startDate: toDbDate(data.startDate),
        endDate: toDbDate(data.endDate),
        coverImageUrl: data.coverImageUrl !== undefined ? data.coverImageUrl : null,
      },
    });
    return toApiTrip(row);
  }

  async function updateTrip(id, data) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const changes = { ...data };
    if ('startDate' in changes) changes.startDate = toDbDate(changes.startDate);
    if ('endDate' in changes) changes.endDate = toDbDate(changes.endDate);

    try {
      const row = await client.trip.update({ where: { id: numericId }, data: changes });
      return toApiTrip(row);
    } catch (err) {
      if (err.code === 'P2025') return null; // record to update not found
      throw err;
    }
  }

  async function deleteTrip(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return;

    try {
      await client.trip.delete({ where: { id: numericId } });
    } catch (err) {
      if (err.code === 'P2025') return; // already gone — idempotent
      throw err;
    }
  }

  return { findTripById, listTripsByUser, createTrip, updateTrip, deleteTrip };
}

module.exports = createPrismaTripRepository;

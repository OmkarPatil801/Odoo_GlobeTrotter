const AppError = require('../../utils/appError');
const HTTP_STATUS = require('../../utils/httpStatus');

// See tripRepository.prisma.js for why dates are handled as UTC-midnight
// Date objects <-> "YYYY-MM-DD" strings rather than full timestamps.
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

function toApiTripStop(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    tripId: String(row.tripId),
    cityId: String(row.cityId),
    stopOrder: row.stopOrder,
    arrivalDate: toDateOnly(row.arrivalDate),
    departureDate: toDateOnly(row.departureDate),
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function stopOrderConflictError() {
  return new AppError(
    'A stop with that order already exists for this trip',
    HTTP_STATUS.CONFLICT,
    'STOP_ORDER_CONFLICT'
  );
}

// Prisma-backed implementation of the TripStopRepository contract
// (see ../contracts/tripStopRepository.contract.js).
//
// `prisma` defaults to the shared client, resolved lazily — see
// userRepository.prisma.js for why.
function createPrismaTripStopRepository(prisma) {
  const client = prisma || require('../../config/prismaClient');

  async function listStopsByTrip(tripId) {
    const numericTripId = Number(tripId);
    if (!Number.isInteger(numericTripId)) return [];

    const rows = await client.tripStop.findMany({
      where: { tripId: numericTripId },
      orderBy: { stopOrder: 'asc' },
    });
    return rows.map(toApiTripStop);
  }

  async function findStopById(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const row = await client.tripStop.findUnique({ where: { id: numericId } });
    return toApiTripStop(row);
  }

  async function createStop(tripId, data) {
    try {
      const row = await client.tripStop.create({
        data: {
          tripId: Number(tripId),
          cityId: Number(data.cityId),
          stopOrder: data.stopOrder,
          arrivalDate: toDbDate(data.arrivalDate),
          departureDate: toDbDate(data.departureDate),
          notes: data.notes !== undefined ? data.notes : null,
        },
      });
      return toApiTripStop(row);
    } catch (err) {
      if (err.code === 'P2002') throw stopOrderConflictError();
      throw err;
    }
  }

  async function updateStop(id, data) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const changes = { ...data };
    if (changes.cityId !== undefined) changes.cityId = Number(changes.cityId);
    if ('arrivalDate' in changes) changes.arrivalDate = toDbDate(changes.arrivalDate);
    if ('departureDate' in changes) changes.departureDate = toDbDate(changes.departureDate);

    try {
      const row = await client.tripStop.update({ where: { id: numericId }, data: changes });
      return toApiTripStop(row);
    } catch (err) {
      if (err.code === 'P2025') return null;
      if (err.code === 'P2002') throw stopOrderConflictError();
      throw err;
    }
  }

  async function deleteStop(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return;

    try {
      await client.tripStop.delete({ where: { id: numericId } });
    } catch (err) {
      if (err.code === 'P2025') return; // already gone — idempotent
      throw err;
    }
  }

  // The (tripId, stopOrder) unique constraint is enforced per-statement by
  // MySQL (no deferrable constraints like Postgres), so a naive sequence
  // of updates straight to the final order can collide mid-sequence (e.g.
  // swapping two stops' order). Phase 1 moves every affected stop to a
  // guaranteed-unique negative stopOrder (the app never otherwise uses
  // negative values), so no phase-1 write can ever collide with another
  // stop's current order. Phase 2 then assigns the final 1..N sequence,
  // and since every stop is already negative, no phase-2 write can
  // collide either. Both phases run inside one Prisma transaction so a
  // failure anywhere leaves stopOrder completely untouched.
  async function reorderStops(tripId, orderedStopIds) {
    const numericTripId = Number(tripId);
    const numericIds = orderedStopIds.map((id) => Number(id));

    const rows = await client.$transaction(async (tx) => {
      for (let i = 0; i < numericIds.length; i += 1) {
        await tx.tripStop.update({
          where: { id: numericIds[i] },
          data: { stopOrder: -(i + 1) },
        });
      }

      for (let i = 0; i < numericIds.length; i += 1) {
        await tx.tripStop.update({
          where: { id: numericIds[i] },
          data: { stopOrder: i + 1 },
        });
      }

      return tx.tripStop.findMany({
        where: { tripId: numericTripId },
        orderBy: { stopOrder: 'asc' },
      });
    });

    return rows.map(toApiTripStop);
  }

  return { listStopsByTrip, findStopById, createStop, updateStop, deleteStop, reorderStops };
}

module.exports = createPrismaTripStopRepository;

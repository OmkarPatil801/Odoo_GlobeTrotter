function toApiShare(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    tripId: String(row.tripId),
    shareToken: row.shareToken,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
  };
}

// Prisma-backed implementation of the TripShareRepository contract
// (see ../contracts/tripShareRepository.contract.js).
//
// `prisma` defaults to the shared client, resolved lazily — see
// userRepository.prisma.js for why.
function createPrismaTripShareRepository(prisma) {
  const client = prisma || require('../../config/prismaClient');

  async function findActiveShareByTripId(tripId) {
    const numericTripId = Number(tripId);
    if (!Number.isInteger(numericTripId)) return null;

    const row = await client.tripShare.findFirst({
      where: { tripId: numericTripId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return toApiShare(row);
  }

  async function findShareByToken(shareToken) {
    const row = await client.tripShare.findUnique({ where: { shareToken } });
    return toApiShare(row);
  }

  async function createShare(tripId, data) {
    const row = await client.tripShare.create({
      data: {
        tripId: Number(tripId),
        shareToken: data.shareToken,
        expiresAt: data.expiresAt !== undefined && data.expiresAt !== null ? new Date(data.expiresAt) : null,
      },
    });
    return toApiShare(row);
  }

  async function deactivateShare(tripId) {
    const numericTripId = Number(tripId);
    if (!Number.isInteger(numericTripId)) return;

    await client.tripShare.updateMany({
      where: { tripId: numericTripId, isActive: true },
      data: { isActive: false },
    });
  }

  return { findActiveShareByTripId, findShareByToken, createShare, deactivateShare };
}

module.exports = createPrismaTripShareRepository;

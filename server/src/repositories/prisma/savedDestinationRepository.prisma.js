function toApiSavedDestination(row) {
  if (!row) return null;
  return {
    userId: String(row.userId),
    cityId: String(row.cityId),
    savedAt: row.savedAt.toISOString(),
  };
}

// Prisma-backed implementation of the SavedDestinationRepository
// contract (see ../contracts/savedDestinationRepository.contract.js).
//
// `prisma` defaults to the shared client, resolved lazily — see
// userRepository.prisma.js for why.
function createPrismaSavedDestinationRepository(prisma) {
  const client = prisma || require('../../config/prismaClient');

  async function listSavedByUser(userId) {
    const rows = await client.savedDestination.findMany({
      where: { userId: Number(userId) },
      orderBy: { savedAt: 'desc' },
    });
    return rows.map(toApiSavedDestination);
  }

  async function saveDestination(userId, cityId) {
    // The composite primary key (userId, cityId) already prevents a
    // duplicate row — upsert makes re-saving idempotent instead of a
    // P2002 conflict the service layer would otherwise have to catch.
    const row = await client.savedDestination.upsert({
      where: { userId_cityId: { userId: Number(userId), cityId: Number(cityId) } },
      update: {},
      create: { userId: Number(userId), cityId: Number(cityId) },
    });
    return toApiSavedDestination(row);
  }

  async function removeSavedDestination(userId, cityId) {
    try {
      await client.savedDestination.delete({
        where: { userId_cityId: { userId: Number(userId), cityId: Number(cityId) } },
      });
    } catch (err) {
      if (err.code === 'P2025') return; // already gone — idempotent
      throw err;
    }
  }

  return { listSavedByUser, saveDestination, removeSavedDestination };
}

module.exports = createPrismaSavedDestinationRepository;

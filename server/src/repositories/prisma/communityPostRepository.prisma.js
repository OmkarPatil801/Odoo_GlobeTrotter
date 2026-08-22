function toApiPost(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    userId: String(row.userId),
    tripId: row.tripId !== null ? String(row.tripId) : null,
    title: row.title,
    content: row.content,
    imageUrl: row.imageUrl,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

// Prisma-backed implementation of the CommunityPostRepository contract
// (see ../contracts/communityPostRepository.contract.js).
//
// `prisma` defaults to the shared client, resolved lazily — see
// userRepository.prisma.js for why.
function createPrismaCommunityPostRepository(prisma) {
  const client = prisma || require('../../config/prismaClient');

  async function listPosts({ page, limit }) {
    const [rows, total] = await Promise.all([
      client.communityPost.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      client.communityPost.count(),
    ]);
    return { items: rows.map(toApiPost), total };
  }

  async function findPostById(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const row = await client.communityPost.findUnique({ where: { id: numericId } });
    return toApiPost(row);
  }

  async function createPost(userId, data) {
    const row = await client.communityPost.create({
      data: {
        userId: Number(userId),
        tripId: data.tripId !== undefined && data.tripId !== null ? Number(data.tripId) : null,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl !== undefined ? data.imageUrl : null,
      },
    });
    return toApiPost(row);
  }

  return { listPosts, findPostById, createPost };
}

module.exports = createPrismaCommunityPostRepository;

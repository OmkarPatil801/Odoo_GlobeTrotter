// In-memory implementation of the CommunityPostRepository contract
// (see ./contracts/communityPostRepository.contract.js). Used until the
// database teammate's real implementation is wired in for local dev
// without a DATABASE_URL, and directly by tests.
function createInMemoryCommunityPostRepository() {
  const postsById = new Map();
  let nextId = 1;

  function toApiPost(row) {
    return { ...row, id: String(row.id), userId: String(row.userId), tripId: row.tripId !== null ? String(row.tripId) : null };
  }

  async function listPosts({ page, limit }) {
    const rows = Array.from(postsById.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const total = rows.length;
    const items = rows.slice((page - 1) * limit, (page - 1) * limit + limit);
    return { items: items.map(toApiPost), total };
  }

  async function findPostById(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const row = postsById.get(numericId);
    return row ? toApiPost(row) : null;
  }

  async function createPost(userId, data) {
    const numericId = nextId;
    nextId += 1;
    const now = new Date().toISOString();

    const row = {
      id: numericId,
      userId: Number(userId),
      tripId: data.tripId !== undefined && data.tripId !== null ? Number(data.tripId) : null,
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl !== undefined ? data.imageUrl : null,
      createdAt: now,
      updatedAt: now,
    };
    postsById.set(numericId, row);
    return toApiPost(row);
  }

  return { listPosts, findPostById, createPost };
}

module.exports = createInMemoryCommunityPostRepository;

// In-memory implementation of the TripRepository contract
// (see ./contracts/tripRepository.contract.js). Used until the database
// teammate's real implementation is wired in for local dev without a
// DATABASE_URL, and directly by tests.
//
// Internally stores rows keyed by a numeric autoincrement-style id, and
// only ever exposes a string id — the same string-in/number-in-storage/
// string-out conversion the real database-backed repository must do at
// this same boundary. `userId` is treated as an opaque string, not
// converted to a number: unlike this repository's own id, it doesn't own
// that representation, and the in-memory UserRepository (see
// inMemoryUserRepository.js) hands out UUID strings, not numeric ones.
// (The real Prisma-backed repository DOES convert userId to a number,
// since Prisma's User.id genuinely is an Int — see
// prisma/tripRepository.prisma.js.)
function createInMemoryTripRepository() {
  const tripsById = new Map();
  let nextId = 1;

  function toApiTrip(row) {
    return { ...row, id: String(row.id) };
  }

  async function findTripById(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const row = tripsById.get(numericId);
    return row ? toApiTrip(row) : null;
  }

  async function listTripsByUser(userId, filters = {}) {
    const targetUserId = String(userId);
    const { status, page, limit } = filters;

    let rows = Array.from(tripsById.values()).filter((trip) => trip.userId === targetUserId);
    if (status) rows = rows.filter((trip) => trip.status === status);

    rows = rows.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    const total = rows.length;
    if (page && limit) {
      const start = (page - 1) * limit;
      rows = rows.slice(start, start + limit);
    }

    return { items: rows.map(toApiTrip), total };
  }

  async function createTrip(userId, data) {
    const numericId = nextId;
    nextId += 1;
    const now = new Date().toISOString();

    const row = {
      id: numericId,
      userId: String(userId),
      name: data.name,
      description: data.description !== undefined ? data.description : null,
      startDate: data.startDate,
      endDate: data.endDate,
      coverImageUrl: data.coverImageUrl !== undefined ? data.coverImageUrl : null,
      status: 'PLANNED',
      isPublic: false,
      createdAt: now,
      updatedAt: now,
    };
    tripsById.set(numericId, row);
    return toApiTrip(row);
  }

  async function updateTrip(id, data) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const existing = tripsById.get(numericId);
    if (!existing) return null;

    const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
    tripsById.set(numericId, updated);
    return toApiTrip(updated);
  }

  async function deleteTrip(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return;
    tripsById.delete(numericId);
  }

  return { findTripById, listTripsByUser, createTrip, updateTrip, deleteTrip };
}

module.exports = createInMemoryTripRepository;

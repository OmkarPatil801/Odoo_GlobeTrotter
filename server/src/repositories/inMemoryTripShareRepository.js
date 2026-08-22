// In-memory implementation of the TripShareRepository contract
// (see ./contracts/tripShareRepository.contract.js). Used until the
// database teammate's real implementation is wired in for local dev
// without a DATABASE_URL, and directly by tests.
function createInMemoryTripShareRepository() {
  const sharesById = new Map();
  let nextId = 1;

  function toApiShare(row) {
    return { ...row, id: String(row.id), tripId: String(row.tripId) };
  }

  async function findActiveShareByTripId(tripId) {
    const rows = Array.from(sharesById.values())
      .filter((share) => String(share.tripId) === String(tripId) && share.isActive)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return rows.length > 0 ? toApiShare(rows[0]) : null;
  }

  async function findShareByToken(shareToken) {
    const row = Array.from(sharesById.values()).find((share) => share.shareToken === shareToken);
    return row ? toApiShare(row) : null;
  }

  async function createShare(tripId, data) {
    const numericId = nextId;
    nextId += 1;

    const row = {
      id: numericId,
      tripId,
      shareToken: data.shareToken,
      isActive: true,
      createdAt: new Date().toISOString(),
      expiresAt: data.expiresAt !== undefined ? data.expiresAt : null,
    };
    sharesById.set(numericId, row);
    return toApiShare(row);
  }

  async function deactivateShare(tripId) {
    Array.from(sharesById.values())
      .filter((share) => String(share.tripId) === String(tripId) && share.isActive)
      .forEach((share) => sharesById.set(share.id, { ...share, isActive: false }));
  }

  return { findActiveShareByTripId, findShareByToken, createShare, deactivateShare };
}

module.exports = createInMemoryTripShareRepository;

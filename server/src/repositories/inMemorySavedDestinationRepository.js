// In-memory implementation of the SavedDestinationRepository contract
// (see ./contracts/savedDestinationRepository.contract.js). Used until
// the database teammate's real implementation is wired in for local dev
// without a DATABASE_URL, and directly by tests.
function createInMemorySavedDestinationRepository() {
  const savedByKey = new Map();

  function key(userId, cityId) {
    return `${userId}:${cityId}`;
  }

  function toApiSavedDestination(row) {
    return { userId: String(row.userId), cityId: String(row.cityId), savedAt: row.savedAt };
  }

  async function listSavedByUser(userId) {
    const rows = Array.from(savedByKey.values())
      .filter((row) => String(row.userId) === String(userId))
      .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
    return rows.map(toApiSavedDestination);
  }

  async function saveDestination(userId, cityId) {
    const k = key(userId, cityId);
    const existing = savedByKey.get(k);
    if (existing) return toApiSavedDestination(existing);

    const row = { userId, cityId, savedAt: new Date().toISOString() };
    savedByKey.set(k, row);
    return toApiSavedDestination(row);
  }

  async function removeSavedDestination(userId, cityId) {
    savedByKey.delete(key(userId, cityId));
  }

  return { listSavedByUser, saveDestination, removeSavedDestination };
}

module.exports = createInMemorySavedDestinationRepository;

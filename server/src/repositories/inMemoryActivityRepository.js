const DEFAULT_ACTIVITIES = require('./seedData/activities.seed');

// In-memory implementation of the ActivityRepository contract
// (see ./contracts/activityRepository.contract.js). Used until the
// database teammate provides a real implementation, and directly by
// tests.
//
// Same string-id <-> numeric-id conversion convention as
// inMemoryCityRepository.js — id and cityId are stored as numbers and
// only ever exposed as strings.
function createInMemoryActivityRepository(seedActivities = DEFAULT_ACTIVITIES) {
  const activitiesById = new Map();

  seedActivities.forEach((activity, index) => {
    const numericId = index + 1;
    activitiesById.set(numericId, { ...activity, id: numericId });
  });

  function toApiActivity(row) {
    return { ...row, id: String(row.id), cityId: String(row.cityId) };
  }

  function applyFilters(rows, { category, minCost, maxCost } = {}) {
    let result = rows;

    if (category) {
      const needle = category.toLowerCase();
      result = result.filter((activity) => activity.category.toLowerCase() === needle);
    }
    if (minCost !== undefined) {
      result = result.filter((activity) => activity.cost >= minCost);
    }
    if (maxCost !== undefined) {
      result = result.filter((activity) => activity.cost <= maxCost);
    }

    return result;
  }

  async function findActivityById(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const row = activitiesById.get(numericId);
    return row ? toApiActivity(row) : null;
  }

  async function listActivitiesByCity(cityId, filters = {}) {
    const numericCityId = Number(cityId);
    let rows = Array.from(activitiesById.values()).filter((activity) => activity.cityId === numericCityId);
    rows = applyFilters(rows, filters);

    const total = rows.length;
    const { page, limit } = filters;

    if (page && limit) {
      const start = (page - 1) * limit;
      rows = rows.slice(start, start + limit);
    }

    return { items: rows.map(toApiActivity), total };
  }

  async function searchActivities(query, filters = {}) {
    const needle = query.toLowerCase();
    let rows = Array.from(activitiesById.values()).filter((activity) => activity.name.toLowerCase().includes(needle));
    rows = applyFilters(rows, filters);
    return rows.map(toApiActivity);
  }

  return { findActivityById, listActivitiesByCity, searchActivities };
}

module.exports = createInMemoryActivityRepository;

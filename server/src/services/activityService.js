const AppError = require('../utils/appError');
const HTTP_STATUS = require('../utils/httpStatus');
const { normalizePagination, buildPaginationMeta } = require('../utils/pagination');

// Express 5 made req.query a read-only getter, so express-validator's
// .toFloat() sanitizer can validate a query param but can't persist the
// converted value back onto req.query — parse here instead of trusting
// the type (see src/utils/pagination.js for the same issue with page/limit).
function parseCost(value) {
  if (value === undefined || value === '') return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

// Factory so the service can be wired to any repository implementation
// that satisfies the ActivityRepository contract
// (see src/repositories/contracts/activityRepository.contract.js).
function createActivityService(activityRepository) {
  async function listActivitiesByCity(cityId, { category, minCost, maxCost, page, limit }) {
    const normalized = normalizePagination({ page, limit });

    const { items, total } = await activityRepository.listActivitiesByCity(cityId, {
      category,
      minCost: parseCost(minCost),
      maxCost: parseCost(maxCost),
      page: normalized.page,
      limit: normalized.limit,
    });

    return { items, meta: buildPaginationMeta({ ...normalized, total }) };
  }

  async function getActivityById(id) {
    const activity = await activityRepository.findActivityById(id);
    if (!activity) {
      throw new AppError('Activity not found', HTTP_STATUS.NOT_FOUND, 'ACTIVITY_NOT_FOUND');
    }
    return activity;
  }

  async function searchActivities(query, { category, minCost, maxCost } = {}) {
    return activityRepository.searchActivities(query, {
      category,
      minCost: parseCost(minCost),
      maxCost: parseCost(maxCost),
    });
  }

  return { listActivitiesByCity, getActivityById, searchActivities };
}

module.exports = createActivityService;

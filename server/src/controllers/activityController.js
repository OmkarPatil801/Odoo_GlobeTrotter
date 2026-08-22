const { success } = require('../utils/apiResponse');

// Factory so tests (or any future composition) can inject a specific
// activityService instance. Controllers only handle req/res and delegate
// everything else to the service.
function createActivityController(activityService) {
  async function listByCity(req, res, next) {
    try {
      const { category, minCost, maxCost, page, limit } = req.query;
      const { items, meta } = await activityService.listActivitiesByCity(req.params.cityId, {
        category,
        minCost,
        maxCost,
        page,
        limit,
      });
      return success(res, items, meta);
    } catch (err) {
      return next(err);
    }
  }

  async function getById(req, res, next) {
    try {
      const activity = await activityService.getActivityById(req.params.id);
      return success(res, { activity });
    } catch (err) {
      return next(err);
    }
  }

  async function search(req, res, next) {
    try {
      const { q, category, minCost, maxCost } = req.query;
      const activities = await activityService.searchActivities(q, { category, minCost, maxCost });
      return success(res, activities);
    } catch (err) {
      return next(err);
    }
  }

  return { listByCity, getById, search };
}

module.exports = createActivityController;

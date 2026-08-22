const { success, created, noContent } = require('../utils/apiResponse');

// Factory so tests (or any future composition) can inject a specific
// tripService instance. Controllers only handle req/res and delegate
// everything else to the service. The authenticated user's id always
// comes from req.user.id (set by the auth middleware from the verified
// JWT) — never from the request body/query/params.
function createTripController(tripService) {
  async function create(req, res, next) {
    try {
      const { name, description, startDate, endDate, coverImageUrl } = req.body;
      const trip = await tripService.createTrip(req.user.id, {
        name,
        description,
        startDate,
        endDate,
        coverImageUrl,
      });
      return created(res, { trip });
    } catch (err) {
      return next(err);
    }
  }

  async function list(req, res, next) {
    try {
      const { status, page, limit } = req.query;
      const { items, meta } = await tripService.listMyTrips(req.user.id, { status, page, limit });
      return success(res, items, meta);
    } catch (err) {
      return next(err);
    }
  }

  async function getById(req, res, next) {
    try {
      const trip = await tripService.getOwnedTrip(req.params.id, req.user.id);
      return success(res, { trip });
    } catch (err) {
      return next(err);
    }
  }

  async function update(req, res, next) {
    try {
      const { name, description, startDate, endDate, coverImageUrl, status, isPublic } = req.body;
      const trip = await tripService.updateTrip(req.params.id, req.user.id, {
        name,
        description,
        startDate,
        endDate,
        coverImageUrl,
        status,
        isPublic,
      });
      return success(res, { trip });
    } catch (err) {
      return next(err);
    }
  }

  async function remove(req, res, next) {
    try {
      await tripService.deleteTrip(req.params.id, req.user.id);
      return noContent(res);
    } catch (err) {
      return next(err);
    }
  }

  return { create, list, getById, update, remove };
}

module.exports = createTripController;

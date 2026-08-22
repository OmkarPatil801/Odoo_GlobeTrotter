const { success, created, noContent } = require('../utils/apiResponse');

// Factory so tests (or any future composition) can inject a specific
// tripStopService instance. Controllers only handle req/res — ownership
// and business rules live in the service.
function createTripStopController(tripStopService) {
  async function list(req, res, next) {
    try {
      const stops = await tripStopService.listStops(req.params.tripId, req.user.id);
      return success(res, stops);
    } catch (err) {
      return next(err);
    }
  }

  async function create(req, res, next) {
    try {
      const { cityId, stopOrder, arrivalDate, departureDate, notes } = req.body;
      const stop = await tripStopService.createStop(req.params.tripId, req.user.id, {
        cityId,
        stopOrder,
        arrivalDate,
        departureDate,
        notes,
      });
      return created(res, { stop });
    } catch (err) {
      return next(err);
    }
  }

  async function update(req, res, next) {
    try {
      const { cityId, stopOrder, arrivalDate, departureDate, notes } = req.body;
      const stop = await tripStopService.updateStop(req.params.tripId, req.params.stopId, req.user.id, {
        cityId,
        stopOrder,
        arrivalDate,
        departureDate,
        notes,
      });
      return success(res, { stop });
    } catch (err) {
      return next(err);
    }
  }

  async function remove(req, res, next) {
    try {
      await tripStopService.deleteStop(req.params.tripId, req.params.stopId, req.user.id);
      return noContent(res);
    } catch (err) {
      return next(err);
    }
  }

  async function reorder(req, res, next) {
    try {
      const stops = await tripStopService.reorderStops(req.params.tripId, req.user.id, req.body.stopIds);
      return success(res, stops);
    } catch (err) {
      return next(err);
    }
  }

  return { list, create, update, remove, reorder };
}

module.exports = createTripStopController;

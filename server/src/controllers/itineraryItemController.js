const { success, created, noContent } = require('../utils/apiResponse');

// Factory so tests (or any future composition) can inject a specific
// itineraryItemService instance. Controllers only handle req/res —
// ownership and business rules live in the service.
function createItineraryItemController(itineraryItemService) {
  async function list(req, res, next) {
    try {
      const filters = req.query.activityDate ? { activityDate: req.query.activityDate } : {};
      const items = await itineraryItemService.listItems(req.params.tripId, req.user.id, filters);
      return success(res, items);
    } catch (err) {
      return next(err);
    }
  }

  async function create(req, res, next) {
    try {
      const { cityId, activityId, activityDate, startTime, endTime, itemOrder, notes } = req.body;
      const item = await itineraryItemService.createItem(req.params.tripId, req.user.id, {
        cityId,
        activityId,
        activityDate,
        startTime,
        endTime,
        itemOrder,
        notes,
      });
      return created(res, { item });
    } catch (err) {
      return next(err);
    }
  }

  async function update(req, res, next) {
    try {
      const { cityId, activityId, activityDate, startTime, endTime, itemOrder, notes } = req.body;
      const item = await itineraryItemService.updateItem(req.params.tripId, req.params.itemId, req.user.id, {
        cityId,
        activityId,
        activityDate,
        startTime,
        endTime,
        itemOrder,
        notes,
      });
      return success(res, { item });
    } catch (err) {
      return next(err);
    }
  }

  async function remove(req, res, next) {
    try {
      await itineraryItemService.deleteItem(req.params.tripId, req.params.itemId, req.user.id);
      return noContent(res);
    } catch (err) {
      return next(err);
    }
  }

  async function reorder(req, res, next) {
    try {
      const items = await itineraryItemService.reorderItems(
        req.params.tripId,
        req.user.id,
        req.body.activityDate,
        req.body.itemIds
      );
      return success(res, items);
    } catch (err) {
      return next(err);
    }
  }

  return { list, create, update, remove, reorder };
}

module.exports = createItineraryItemController;

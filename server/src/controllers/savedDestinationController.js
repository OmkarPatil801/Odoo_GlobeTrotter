const { success, created, noContent } = require('../utils/apiResponse');

// Factory so tests (or any future composition) can inject a specific
// savedDestinationService instance. Controllers only handle req/res —
// the authenticated user's id always comes from req.user.id, never from
// the request body/query/params.
function createSavedDestinationController(savedDestinationService) {
  async function list(req, res, next) {
    try {
      const saved = await savedDestinationService.listSaved(req.user.id);
      return success(res, saved);
    } catch (err) {
      return next(err);
    }
  }

  async function save(req, res, next) {
    try {
      const saved = await savedDestinationService.saveDestination(req.user.id, req.body.cityId);
      return created(res, { saved });
    } catch (err) {
      return next(err);
    }
  }

  async function remove(req, res, next) {
    try {
      await savedDestinationService.removeSavedDestination(req.user.id, req.params.cityId);
      return noContent(res);
    } catch (err) {
      return next(err);
    }
  }

  return { list, save, remove };
}

module.exports = createSavedDestinationController;

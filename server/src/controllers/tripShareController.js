const { success, created, noContent } = require('../utils/apiResponse');

// Factory so tests (or any future composition) can inject a specific
// tripShareService instance. Controllers only handle req/res — ownership
// and business rules live in the service.
function createTripShareController(tripShareService) {
  async function share(req, res, next) {
    try {
      const shareRecord = await tripShareService.createOrReuseShare(req.params.tripId, req.user.id);
      return created(res, { share: shareRecord });
    } catch (err) {
      return next(err);
    }
  }

  async function unshare(req, res, next) {
    try {
      await tripShareService.revokeShare(req.params.tripId, req.user.id);
      return noContent(res);
    } catch (err) {
      return next(err);
    }
  }

  async function getSharedTrip(req, res, next) {
    try {
      const sharedTrip = await tripShareService.getSharedTrip(req.params.shareToken);
      return success(res, sharedTrip);
    } catch (err) {
      return next(err);
    }
  }

  return { share, unshare, getSharedTrip };
}

module.exports = createTripShareController;

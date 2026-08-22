const { success } = require('../utils/apiResponse');

// Factory so tests (or any future composition) can inject a specific
// userService instance. Controllers only handle req/res and delegate to
// the service — the authenticated user's id always comes from
// req.user.id (set by the auth middleware from the verified JWT), never
// from the request body/query/params.
function createUserController(userService) {
  async function getMe(req, res, next) {
    try {
      const user = await userService.getProfile(req.user.id);
      return success(res, { user });
    } catch (err) {
      return next(err);
    }
  }

  async function updateMe(req, res, next) {
    try {
      // Only ever read `name`/`email` off the body — this is what keeps
      // id/passwordHash/anything else from being changed through this
      // endpoint, regardless of what a client sends.
      const { name, email } = req.body;
      const user = await userService.updateProfile(req.user.id, { name, email });
      return success(res, { user });
    } catch (err) {
      return next(err);
    }
  }

  return { getMe, updateMe };
}

module.exports = createUserController;

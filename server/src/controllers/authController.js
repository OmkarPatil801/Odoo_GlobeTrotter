const { success, created } = require('../utils/apiResponse');

// Factory so tests (or any future composition) can inject a specific
// authService instance instead of relying on the app's default wiring.
// Controllers only handle req/res and delegate everything else to the
// service.
function createAuthController(authService) {
  async function register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register({ name, email, password });
      return created(res, result);
    } catch (err) {
      return next(err);
    }
  }

  async function login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      return success(res, result);
    } catch (err) {
      return next(err);
    }
  }

  async function me(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      return success(res, { user });
    } catch (err) {
      return next(err);
    }
  }

  return { register, login, me };
}

module.exports = createAuthController;

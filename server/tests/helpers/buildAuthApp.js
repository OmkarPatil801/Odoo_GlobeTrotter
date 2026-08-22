const express = require('express');

const createInMemoryUserRepository = require('../../src/repositories/inMemoryUserRepository');
const createAuthService = require('../../src/services/authService');
const createAuthController = require('../../src/controllers/authController');
const authenticate = require('../../src/middleware/auth');
const { validate } = require('../../src/validators');
const { registerValidation, loginValidation } = require('../../src/validators/authValidators');
const errorHandler = require('../../src/middleware/errorHandler');
const notFoundHandler = require('../../src/middleware/notFoundHandler');

// Mirrors src/routes/auth.routes.js's wiring but with a brand new
// in-memory repository per call, so each test suite starts from a clean,
// isolated slate — this is the "clean repository mock" the auth layer is
// tested against instead of a real database.
function buildAuthApp() {
  const userRepository = createInMemoryUserRepository();
  const authService = createAuthService(userRepository);
  const authController = createAuthController(authService);

  const app = express();
  app.use(express.json());

  const router = express.Router();
  router.post('/register', registerValidation, validate, authController.register);
  router.post('/login', loginValidation, validate, authController.login);
  router.get('/me', authenticate, authController.me);

  app.use('/api/auth', router);
  app.use('/api', notFoundHandler);
  app.use(errorHandler);

  return { app, userRepository };
}

module.exports = buildAuthApp;

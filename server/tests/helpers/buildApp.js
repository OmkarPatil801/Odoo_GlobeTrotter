const express = require('express');

const createInMemoryUserRepository = require('../../src/repositories/inMemoryUserRepository');
const createAuthService = require('../../src/services/authService');
const createAuthController = require('../../src/controllers/authController');
const createUserService = require('../../src/services/userService');
const createUserController = require('../../src/controllers/userController');
const authenticate = require('../../src/middleware/auth');
const { validate } = require('../../src/validators');
const { registerValidation, loginValidation } = require('../../src/validators/authValidators');
const { requireAtLeastOneUpdatableField, updateProfileValidation } = require('../../src/validators/userValidators');
const errorHandler = require('../../src/middleware/errorHandler');
const notFoundHandler = require('../../src/middleware/notFoundHandler');

// Mirrors src/app.js's auth + users wiring, but with a brand new
// in-memory repository per call so each test suite starts from a clean,
// isolated slate — used for tests that need both register/login and
// profile endpoints sharing the same repository instance.
function buildApp() {
  const userRepository = createInMemoryUserRepository();

  const authService = createAuthService(userRepository);
  const authController = createAuthController(authService);

  const userService = createUserService(userRepository);
  const userController = createUserController(userService);

  const app = express();
  app.use(express.json());

  const authRouter = express.Router();
  authRouter.post('/register', registerValidation, validate, authController.register);
  authRouter.post('/login', loginValidation, validate, authController.login);
  authRouter.get('/me', authenticate, authController.me);

  const usersRouter = express.Router();
  usersRouter.get('/me', authenticate, userController.getMe);
  usersRouter.put(
    '/me',
    authenticate,
    requireAtLeastOneUpdatableField,
    updateProfileValidation,
    validate,
    userController.updateMe
  );

  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api', notFoundHandler);
  app.use(errorHandler);

  return { app, userRepository };
}

module.exports = buildApp;

const express = require('express');

const createAuthController = require('../controllers/authController');
const createAuthService = require('../services/authService');
const { userRepository } = require('../repositories');
const authenticate = require('../middleware/auth');
const { registerLimiter, loginLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../validators');
const { registerValidation, loginValidation } = require('../validators/authValidators');

// Default wiring for the running app — in-memory or Prisma, chosen once
// in src/repositories/index.js.
const authService = createAuthService(userRepository);
const authController = createAuthController(authService);

const router = express.Router();

// Stricter than the general API rate limit (see app.js) — these two
// endpoints are the most attractive targets for account-creation spam
// and credential-stuffing/brute-force attacks.
router.post('/register', registerLimiter, registerValidation, validate, authController.register);
router.post('/login', loginLimiter, loginValidation, validate, authController.login);
router.get('/me', authenticate, authController.me);

module.exports = router;

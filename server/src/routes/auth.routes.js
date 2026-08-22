const express = require('express');

const createAuthController = require('../controllers/authController');
const createAuthService = require('../services/authService');
const { userRepository } = require('../repositories');
const authenticate = require('../middleware/auth');
const { validate } = require('../validators');
const { registerValidation, loginValidation } = require('../validators/authValidators');

// Default wiring for the running app — in-memory or Prisma, chosen once
// in src/repositories/index.js.
const authService = createAuthService(userRepository);
const authController = createAuthController(authService);

const router = express.Router();

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.get('/me', authenticate, authController.me);

module.exports = router;

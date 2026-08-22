const express = require('express');

const createUserController = require('../controllers/userController');
const createUserService = require('../services/userService');
const { userRepository } = require('../repositories');
const authenticate = require('../middleware/auth');
const { validate } = require('../validators');
const { requireAtLeastOneUpdatableField, updateProfileValidation } = require('../validators/userValidators');

// Default wiring for the running app — same repository instance as
// src/routes/auth.routes.js (see src/repositories/index.js).
const userService = createUserService(userRepository);
const userController = createUserController(userService);

const router = express.Router();

router.get('/me', authenticate, userController.getMe);
router.put(
  '/me',
  authenticate,
  requireAtLeastOneUpdatableField,
  updateProfileValidation,
  validate,
  userController.updateMe
);

module.exports = router;

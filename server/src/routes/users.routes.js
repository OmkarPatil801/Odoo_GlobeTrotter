const express = require('express');

const createUserController = require('../controllers/userController');
const createUserService = require('../services/userService');
const createSavedDestinationController = require('../controllers/savedDestinationController');
const createSavedDestinationService = require('../services/savedDestinationService');
const { userRepository, savedDestinationRepository, cityRepository } = require('../repositories');
const authenticate = require('../middleware/auth');
const { validate } = require('../validators');
const { requireAtLeastOneUpdatableField, updateProfileValidation } = require('../validators/userValidators');
const { cityIdParamValidation, saveDestinationValidation } = require('../validators/savedDestinationValidators');

// Default wiring for the running app — same repository instance as
// src/routes/auth.routes.js (see src/repositories/index.js).
const userService = createUserService(userRepository);
const userController = createUserController(userService);

const savedDestinationService = createSavedDestinationService({ savedDestinationRepository, cityRepository });
const savedDestinationController = createSavedDestinationController(savedDestinationService);

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

// Saved destinations are always scoped to the authenticated user (never
// an arbitrary userId in the URL) — see savedDestinationController.js.
router.get('/me/saved-destinations', authenticate, savedDestinationController.list);
router.post(
  '/me/saved-destinations',
  authenticate,
  saveDestinationValidation,
  validate,
  savedDestinationController.save
);
router.delete(
  '/me/saved-destinations/:cityId',
  authenticate,
  cityIdParamValidation,
  validate,
  savedDestinationController.remove
);

module.exports = router;

const express = require('express');

const createCityController = require('../controllers/cityController');
const createCityService = require('../services/cityService');
const createActivityController = require('../controllers/activityController');
const createActivityService = require('../services/activityService');
const { cityRepository, activityRepository } = require('../repositories');
const { validate } = require('../validators');
const { cityIdParamValidation, listCitiesValidation, searchCitiesValidation } = require('../validators/cityValidators');
const {
  cityIdParamValidation: cityActivitiesCityIdValidation,
  listCityActivitiesValidation,
} = require('../validators/activityValidators');

// Default wiring for the running app — in-memory or Prisma repositories,
// chosen once in src/repositories/index.js.
const cityService = createCityService(cityRepository);
const cityController = createCityController(cityService);

const activityService = createActivityService(activityRepository);
const activityController = createActivityController(activityService);

const router = express.Router();

// All public — no authentication required. Order matters: /search and
// /:cityId/activities must be registered before /:id so they aren't
// swallowed by the single-segment :id param route.
router.get('/search', searchCitiesValidation, validate, cityController.search);
router.get(
  '/:cityId/activities',
  cityActivitiesCityIdValidation,
  listCityActivitiesValidation,
  validate,
  activityController.listByCity
);
router.get('/', listCitiesValidation, validate, cityController.list);
router.get('/:id', cityIdParamValidation, validate, cityController.getById);

module.exports = router;

const express = require('express');

const createInMemoryCityRepository = require('../../src/repositories/inMemoryCityRepository');
const createInMemoryActivityRepository = require('../../src/repositories/inMemoryActivityRepository');
const createCityService = require('../../src/services/cityService');
const createCityController = require('../../src/controllers/cityController');
const createActivityService = require('../../src/services/activityService');
const createActivityController = require('../../src/controllers/activityController');
const { validate } = require('../../src/validators');
const { cityIdParamValidation, listCitiesValidation, searchCitiesValidation } = require('../../src/validators/cityValidators');
const {
  activityIdParamValidation,
  cityIdParamValidation: cityActivitiesCityIdValidation,
  listCityActivitiesValidation,
  searchActivitiesValidation,
} = require('../../src/validators/activityValidators');
const errorHandler = require('../../src/middleware/errorHandler');
const notFoundHandler = require('../../src/middleware/notFoundHandler');

// Mirrors src/routes/cities.routes.js + activities.routes.js's wiring but
// with brand new in-memory repositories per call, following the
// CityRepository/ActivityRepository contracts — the "clean mock
// repository" this layer is tested against instead of a real database.
function buildCitiesApp({ seedCities, seedActivities } = {}) {
  const cityRepository = createInMemoryCityRepository(seedCities);
  const activityRepository = createInMemoryActivityRepository(seedActivities);

  const cityService = createCityService(cityRepository);
  const cityController = createCityController(cityService);

  const activityService = createActivityService(activityRepository);
  const activityController = createActivityController(activityService);

  const app = express();
  app.use(express.json());

  const citiesRouter = express.Router();
  citiesRouter.get('/search', searchCitiesValidation, validate, cityController.search);
  citiesRouter.get(
    '/:cityId/activities',
    cityActivitiesCityIdValidation,
    listCityActivitiesValidation,
    validate,
    activityController.listByCity
  );
  citiesRouter.get('/', listCitiesValidation, validate, cityController.list);
  citiesRouter.get('/:id', cityIdParamValidation, validate, cityController.getById);

  const activitiesRouter = express.Router();
  activitiesRouter.get('/search', searchActivitiesValidation, validate, activityController.search);
  activitiesRouter.get('/:id', activityIdParamValidation, validate, activityController.getById);

  app.use('/api/cities', citiesRouter);
  app.use('/api/activities', activitiesRouter);
  app.use('/api', notFoundHandler);
  app.use(errorHandler);

  return { app, cityRepository, activityRepository };
}

module.exports = buildCitiesApp;

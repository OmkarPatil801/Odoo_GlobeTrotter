const express = require('express');

const createInMemoryUserRepository = require('../../src/repositories/inMemoryUserRepository');
const createInMemoryCityRepository = require('../../src/repositories/inMemoryCityRepository');
const createInMemoryTripRepository = require('../../src/repositories/inMemoryTripRepository');
const createInMemoryTripStopRepository = require('../../src/repositories/inMemoryTripStopRepository');

const createAuthService = require('../../src/services/authService');
const createAuthController = require('../../src/controllers/authController');
const createTripService = require('../../src/services/tripService');
const createTripController = require('../../src/controllers/tripController');
const createTripStopService = require('../../src/services/tripStopService');
const createTripStopController = require('../../src/controllers/tripStopController');

const authenticate = require('../../src/middleware/auth');
const { validate } = require('../../src/validators');
const { registerValidation } = require('../../src/validators/authValidators');
const {
  tripIdParamValidation,
  createTripValidation,
  updateTripValidation,
  listTripsValidation,
  requireAtLeastOneTripField,
} = require('../../src/validators/tripValidators');
const {
  tripIdParamValidation: stopsTripIdParamValidation,
  stopIdParamValidation,
  createStopValidation,
  updateStopValidation,
  reorderStopsValidation,
  requireAtLeastOneStopField,
} = require('../../src/validators/tripStopValidators');

const errorHandler = require('../../src/middleware/errorHandler');
const notFoundHandler = require('../../src/middleware/notFoundHandler');

// Mirrors src/app.js's auth + trips wiring with brand new in-memory
// repositories per call — used for trip/trip-stop tests, which need a
// real registered user (for a valid JWT) plus city data (for stop city
// existence checks). Only /api/auth/register is exposed from the auth
// side; these tests don't need login/me.
function buildTripsApp({ seedCities } = {}) {
  const userRepository = createInMemoryUserRepository();
  const cityRepository = createInMemoryCityRepository(seedCities);
  const tripRepository = createInMemoryTripRepository();
  const tripStopRepository = createInMemoryTripStopRepository();

  const authService = createAuthService(userRepository);
  const authController = createAuthController(authService);

  const tripService = createTripService(tripRepository);
  const tripController = createTripController(tripService);

  const tripStopService = createTripStopService({ tripRepository, tripStopRepository, cityRepository });
  const tripStopController = createTripStopController(tripStopService);

  const app = express();
  app.use(express.json());

  const authRouter = express.Router();
  authRouter.post('/register', registerValidation, validate, authController.register);
  app.use('/api/auth', authRouter);

  const tripsRouter = express.Router();
  tripsRouter.post('/', authenticate, createTripValidation, validate, tripController.create);
  tripsRouter.get('/', authenticate, listTripsValidation, validate, tripController.list);

  tripsRouter.get('/:tripId/stops', authenticate, stopsTripIdParamValidation, validate, tripStopController.list);
  tripsRouter.post(
    '/:tripId/stops',
    authenticate,
    stopsTripIdParamValidation,
    createStopValidation,
    validate,
    tripStopController.create
  );
  tripsRouter.put(
    '/:tripId/stops/reorder',
    authenticate,
    stopsTripIdParamValidation,
    reorderStopsValidation,
    validate,
    tripStopController.reorder
  );
  tripsRouter.put(
    '/:tripId/stops/:stopId',
    authenticate,
    stopsTripIdParamValidation,
    stopIdParamValidation,
    requireAtLeastOneStopField,
    updateStopValidation,
    validate,
    tripStopController.update
  );
  tripsRouter.delete(
    '/:tripId/stops/:stopId',
    authenticate,
    stopsTripIdParamValidation,
    stopIdParamValidation,
    validate,
    tripStopController.remove
  );

  tripsRouter.get('/:id', authenticate, tripIdParamValidation, validate, tripController.getById);
  tripsRouter.put(
    '/:id',
    authenticate,
    tripIdParamValidation,
    requireAtLeastOneTripField,
    updateTripValidation,
    validate,
    tripController.update
  );
  tripsRouter.delete('/:id', authenticate, tripIdParamValidation, validate, tripController.remove);

  app.use('/api/trips', tripsRouter);
  app.use('/api', notFoundHandler);
  app.use(errorHandler);

  return { app, userRepository, cityRepository, tripRepository, tripStopRepository };
}

module.exports = buildTripsApp;

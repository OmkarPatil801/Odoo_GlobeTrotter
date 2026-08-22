const express = require('express');

const createTripController = require('../controllers/tripController');
const createTripService = require('../services/tripService');
const createTripStopController = require('../controllers/tripStopController');
const createTripStopService = require('../services/tripStopService');
const { tripRepository, tripStopRepository, cityRepository } = require('../repositories');
const authenticate = require('../middleware/auth');
const { validate } = require('../validators');
const {
  tripIdParamValidation,
  createTripValidation,
  updateTripValidation,
  listTripsValidation,
  requireAtLeastOneTripField,
} = require('../validators/tripValidators');
const {
  tripIdParamValidation: stopsTripIdParamValidation,
  stopIdParamValidation,
  createStopValidation,
  updateStopValidation,
  reorderStopsValidation,
  requireAtLeastOneStopField,
} = require('../validators/tripStopValidators');

// Default wiring for the running app — in-memory or Prisma repositories,
// chosen once in src/repositories/index.js.
const tripService = createTripService(tripRepository);
const tripController = createTripController(tripService);

const tripStopService = createTripStopService({ tripRepository, tripStopRepository, cityRepository });
const tripStopController = createTripStopController(tripStopService);

const router = express.Router();

// Every trip/trip-stop endpoint is authenticated and only ever acts on
// the authenticated user's own trips — ownership is enforced in
// tripService/tripStopService, never trusted from the request.
router.post('/', authenticate, createTripValidation, validate, tripController.create);
router.get('/', authenticate, listTripsValidation, validate, tripController.list);

// Stop routes nested under a trip. Order matters: the static "reorder"
// segment must be registered before the dynamic ":stopId" route so a PUT
// to .../stops/reorder isn't swallowed as an update to a stop literally
// named "reorder".
router.get('/:tripId/stops', authenticate, stopsTripIdParamValidation, validate, tripStopController.list);
router.post(
  '/:tripId/stops',
  authenticate,
  stopsTripIdParamValidation,
  createStopValidation,
  validate,
  tripStopController.create
);
router.put(
  '/:tripId/stops/reorder',
  authenticate,
  stopsTripIdParamValidation,
  reorderStopsValidation,
  validate,
  tripStopController.reorder
);
router.put(
  '/:tripId/stops/:stopId',
  authenticate,
  stopsTripIdParamValidation,
  stopIdParamValidation,
  requireAtLeastOneStopField,
  updateStopValidation,
  validate,
  tripStopController.update
);
router.delete(
  '/:tripId/stops/:stopId',
  authenticate,
  stopsTripIdParamValidation,
  stopIdParamValidation,
  validate,
  tripStopController.remove
);

router.get('/:id', authenticate, tripIdParamValidation, validate, tripController.getById);
router.put(
  '/:id',
  authenticate,
  tripIdParamValidation,
  requireAtLeastOneTripField,
  updateTripValidation,
  validate,
  tripController.update
);
router.delete('/:id', authenticate, tripIdParamValidation, validate, tripController.remove);

module.exports = router;

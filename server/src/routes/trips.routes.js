const express = require('express');

const createTripController = require('../controllers/tripController');
const createTripService = require('../services/tripService');
const createTripStopController = require('../controllers/tripStopController');
const createTripStopService = require('../services/tripStopService');
const createItineraryItemController = require('../controllers/itineraryItemController');
const createItineraryItemService = require('../services/itineraryItemService');
const createExpenseController = require('../controllers/expenseController');
const createExpenseService = require('../services/expenseService');
const createTripShareController = require('../controllers/tripShareController');
const createTripShareService = require('../services/tripShareService');
const {
  tripRepository,
  tripStopRepository,
  cityRepository,
  activityRepository,
  itineraryItemRepository,
  expenseRepository,
  tripShareRepository,
} = require('../repositories');
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
const {
  tripIdParamValidation: itineraryTripIdParamValidation,
  itemIdParamValidation,
  listItemsValidation,
  createItemValidation,
  updateItemValidation,
  reorderItemsValidation,
  requireAtLeastOneItemField,
} = require('../validators/itineraryItemValidators');
const {
  tripIdParamValidation: expenseTripIdParamValidation,
  expenseIdParamValidation,
  listExpensesValidation,
  createExpenseValidation,
} = require('../validators/expenseValidators');

// Default wiring for the running app — in-memory or Prisma repositories,
// chosen once in src/repositories/index.js.
const tripService = createTripService(tripRepository);
const tripController = createTripController(tripService);

const tripStopService = createTripStopService({ tripRepository, tripStopRepository, cityRepository });
const tripStopController = createTripStopController(tripStopService);

const itineraryItemService = createItineraryItemService({
  tripRepository,
  itineraryItemRepository,
  cityRepository,
  activityRepository,
});
const itineraryItemController = createItineraryItemController(itineraryItemService);

const expenseService = createExpenseService({ tripRepository, expenseRepository });
const expenseController = createExpenseController(expenseService);

const tripShareService = createTripShareService({
  tripRepository,
  tripStopRepository,
  itineraryItemRepository,
  tripShareRepository,
});
const tripShareController = createTripShareController(tripShareService);

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

// Itinerary routes nested under a trip. Same ordering rule as stops:
// the static "reorder" segment must be registered before ":itemId".
router.get(
  '/:tripId/itinerary',
  authenticate,
  itineraryTripIdParamValidation,
  listItemsValidation,
  validate,
  itineraryItemController.list
);
router.post(
  '/:tripId/itinerary',
  authenticate,
  itineraryTripIdParamValidation,
  createItemValidation,
  validate,
  itineraryItemController.create
);
router.put(
  '/:tripId/itinerary/reorder',
  authenticate,
  itineraryTripIdParamValidation,
  reorderItemsValidation,
  validate,
  itineraryItemController.reorder
);
router.put(
  '/:tripId/itinerary/:itemId',
  authenticate,
  itineraryTripIdParamValidation,
  itemIdParamValidation,
  requireAtLeastOneItemField,
  updateItemValidation,
  validate,
  itineraryItemController.update
);
router.delete(
  '/:tripId/itinerary/:itemId',
  authenticate,
  itineraryTripIdParamValidation,
  itemIdParamValidation,
  validate,
  itineraryItemController.remove
);

// Expense/budget routes nested under a trip. "budget" is a static
// segment registered ahead of no conflicting dynamic route here, but
// kept alongside the other trip-scoped resources for consistency.
router.get(
  '/:tripId/expenses',
  authenticate,
  expenseTripIdParamValidation,
  listExpensesValidation,
  validate,
  expenseController.list
);
router.post(
  '/:tripId/expenses',
  authenticate,
  expenseTripIdParamValidation,
  createExpenseValidation,
  validate,
  expenseController.create
);
router.delete(
  '/:tripId/expenses/:expenseId',
  authenticate,
  expenseTripIdParamValidation,
  expenseIdParamValidation,
  validate,
  expenseController.remove
);
router.get('/:tripId/budget', authenticate, expenseTripIdParamValidation, validate, expenseController.getBudget);

// Sharing routes nested under a trip — creating/revoking a share
// requires trip ownership (authenticated); the public read-only lookup
// by token lives at GET /api/shared-trips/:shareToken (see
// tripShares.routes.js), not here.
router.post('/:tripId/share', authenticate, expenseTripIdParamValidation, validate, tripShareController.share);
router.delete('/:tripId/share', authenticate, expenseTripIdParamValidation, validate, tripShareController.unshare);

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

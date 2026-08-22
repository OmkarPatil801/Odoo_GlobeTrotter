const express = require('express');
const { param } = require('express-validator');

const createTripShareController = require('../controllers/tripShareController');
const createTripShareService = require('../services/tripShareService');
const { tripRepository, tripStopRepository, itineraryItemRepository, tripShareRepository } = require('../repositories');
const { validate } = require('../validators');

// Default wiring for the running app — same repository instances as
// src/routes/trips.routes.js (see src/repositories/index.js). Kept as a
// separate top-level route (mounted at /api/shared-trips in app.js)
// rather than nested under /api/trips, since this endpoint is
// deliberately public (no auth) and identifies the trip by its opaque
// share token, never its internal id.
const tripShareService = createTripShareService({
  tripRepository,
  tripStopRepository,
  itineraryItemRepository,
  tripShareRepository,
});
const tripShareController = createTripShareController(tripShareService);

const shareTokenParamValidation = [param('shareToken').trim().notEmpty().withMessage('Share token is required')];

const router = express.Router();

router.get('/:shareToken', shareTokenParamValidation, validate, tripShareController.getSharedTrip);

module.exports = router;

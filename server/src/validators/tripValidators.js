const { body, param, query } = require('express-validator');
const AppError = require('../utils/appError');

const TRIP_STATUSES = ['PLANNED', 'ONGOING', 'COMPLETED'];
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const UPDATABLE_TRIP_FIELDS = ['name', 'description', 'startDate', 'endDate', 'coverImageUrl', 'status', 'isPublic'];

const tripIdParamValidation = [param('id').trim().notEmpty().withMessage('Trip id is required')];

const createTripValidation = [
  body('name')
    .trim()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 2, max: 200 })
    .withMessage('Name must be between 2 and 200 characters'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 5000 })
    .withMessage('Description must be at most 5000 characters'),
  body('startDate')
    .trim()
    .matches(DATE_ONLY_PATTERN)
    .withMessage('startDate must be a calendar date in YYYY-MM-DD format')
    .bail()
    .isISO8601({ strict: true })
    .withMessage('startDate must be a valid calendar date'),
  body('endDate')
    .trim()
    .matches(DATE_ONLY_PATTERN)
    .withMessage('endDate must be a calendar date in YYYY-MM-DD format')
    .bail()
    .isISO8601({ strict: true })
    .withMessage('endDate must be a valid calendar date'),
  body('coverImageUrl').optional().trim().isURL().withMessage('coverImageUrl must be a valid URL'),
];

// Partial update — every field optional, but format-checked when present.
// The endDate >= startDate rule is re-checked in the service after
// merging with the existing trip (see tripService.js), since a partial
// update might only touch one of the two dates.
const updateTripValidation = [
  body('name')
    .optional()
    .trim()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 2, max: 200 })
    .withMessage('Name must be between 2 and 200 characters'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 5000 })
    .withMessage('Description must be at most 5000 characters'),
  body('startDate')
    .optional()
    .trim()
    .matches(DATE_ONLY_PATTERN)
    .withMessage('startDate must be a calendar date in YYYY-MM-DD format')
    .bail()
    .isISO8601({ strict: true })
    .withMessage('startDate must be a valid calendar date'),
  body('endDate')
    .optional()
    .trim()
    .matches(DATE_ONLY_PATTERN)
    .withMessage('endDate must be a calendar date in YYYY-MM-DD format')
    .bail()
    .isISO8601({ strict: true })
    .withMessage('endDate must be a valid calendar date'),
  body('coverImageUrl').optional().trim().isURL().withMessage('coverImageUrl must be a valid URL'),
  body('status').optional().isIn(TRIP_STATUSES).withMessage(`status must be one of ${TRIP_STATUSES.join(', ')}`),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean').toBoolean(),
];

const listTripsValidation = [
  query('status').optional().isIn(TRIP_STATUSES).withMessage(`status must be one of ${TRIP_STATUSES.join(', ')}`),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer').toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100')
    .toInt(),
];

// PUT /api/trips/:id supports partial updates, but at least one
// supported field must be present — same convention as
// userValidators.js's requireAtLeastOneUpdatableField.
function requireAtLeastOneTripField(req, res, next) {
  const requestBody = req.body || {};
  const hasAny = UPDATABLE_TRIP_FIELDS.some((field) => Object.prototype.hasOwnProperty.call(requestBody, field));

  if (!hasAny) {
    return next(
      AppError.unprocessable('Provide at least one field to update', [
        { field: 'body', message: `At least one of ${UPDATABLE_TRIP_FIELDS.join(', ')} must be provided` },
      ])
    );
  }

  return next();
}

module.exports = {
  tripIdParamValidation,
  createTripValidation,
  updateTripValidation,
  listTripsValidation,
  requireAtLeastOneTripField,
};

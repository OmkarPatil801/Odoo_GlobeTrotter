const { body, param } = require('express-validator');
const AppError = require('../utils/appError');

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const UPDATABLE_STOP_FIELDS = ['cityId', 'stopOrder', 'arrivalDate', 'departureDate', 'notes'];

const tripIdParamValidation = [param('tripId').trim().notEmpty().withMessage('Trip id is required')];
const stopIdParamValidation = [param('stopId').trim().notEmpty().withMessage('Trip stop id is required')];

const createStopValidation = [
  body('cityId').trim().notEmpty().withMessage('cityId is required'),
  body('stopOrder').isInt({ min: 1 }).withMessage('stopOrder must be a positive integer').toInt(),
  body('arrivalDate')
    .trim()
    .matches(DATE_ONLY_PATTERN)
    .withMessage('arrivalDate must be a calendar date in YYYY-MM-DD format')
    .bail()
    .isISO8601({ strict: true })
    .withMessage('arrivalDate must be a valid calendar date'),
  body('departureDate')
    .trim()
    .matches(DATE_ONLY_PATTERN)
    .withMessage('departureDate must be a calendar date in YYYY-MM-DD format')
    .bail()
    .isISO8601({ strict: true })
    .withMessage('departureDate must be a valid calendar date'),
  body('notes')
    .optional()
    .isString()
    .withMessage('notes must be a string')
    .isLength({ max: 2000 })
    .withMessage('notes must be at most 2000 characters'),
];

// Partial update — every field optional. departureDate >= arrivalDate is
// re-checked in the service after merging with the existing stop (see
// tripStopService.js), since a partial update might only touch one date.
const updateStopValidation = [
  body('cityId').optional().trim().notEmpty().withMessage('cityId must not be empty'),
  body('stopOrder').optional().isInt({ min: 1 }).withMessage('stopOrder must be a positive integer').toInt(),
  body('arrivalDate')
    .optional()
    .trim()
    .matches(DATE_ONLY_PATTERN)
    .withMessage('arrivalDate must be a calendar date in YYYY-MM-DD format')
    .bail()
    .isISO8601({ strict: true })
    .withMessage('arrivalDate must be a valid calendar date'),
  body('departureDate')
    .optional()
    .trim()
    .matches(DATE_ONLY_PATTERN)
    .withMessage('departureDate must be a calendar date in YYYY-MM-DD format')
    .bail()
    .isISO8601({ strict: true })
    .withMessage('departureDate must be a valid calendar date'),
  body('notes')
    .optional()
    .isString()
    .withMessage('notes must be a string')
    .isLength({ max: 2000 })
    .withMessage('notes must be at most 2000 characters'),
];

const reorderStopsValidation = [
  body('stopIds').isArray({ min: 1 }).withMessage('stopIds must be a non-empty array'),
  body('stopIds.*')
    .isString()
    .withMessage('Each stopId must be a string')
    .trim()
    .notEmpty()
    .withMessage('Each stopId must not be empty'),
];

// PUT /api/trips/:tripId/stops/:stopId supports partial updates, but at
// least one supported field must be present.
function requireAtLeastOneStopField(req, res, next) {
  const requestBody = req.body || {};
  const hasAny = UPDATABLE_STOP_FIELDS.some((field) => Object.prototype.hasOwnProperty.call(requestBody, field));

  if (!hasAny) {
    return next(
      AppError.unprocessable('Provide at least one field to update', [
        { field: 'body', message: `At least one of ${UPDATABLE_STOP_FIELDS.join(', ')} must be provided` },
      ])
    );
  }

  return next();
}

module.exports = {
  tripIdParamValidation,
  stopIdParamValidation,
  createStopValidation,
  updateStopValidation,
  reorderStopsValidation,
  requireAtLeastOneStopField,
};

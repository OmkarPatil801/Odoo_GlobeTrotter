const { body, param, query } = require('express-validator');
const AppError = require('../utils/appError');

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_ONLY_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const UPDATABLE_ITEM_FIELDS = ['cityId', 'activityId', 'activityDate', 'startTime', 'endTime', 'itemOrder', 'notes'];

const tripIdParamValidation = [param('tripId').trim().notEmpty().withMessage('Trip id is required')];
const itemIdParamValidation = [param('itemId').trim().notEmpty().withMessage('Itinerary item id is required')];

const listItemsValidation = [
  query('activityDate')
    .optional()
    .trim()
    .matches(DATE_ONLY_PATTERN)
    .withMessage('activityDate must be a calendar date in YYYY-MM-DD format'),
];

const createItemValidation = [
  body('cityId').trim().notEmpty().withMessage('cityId is required'),
  body('activityId').optional({ nullable: true }).trim().notEmpty().withMessage('activityId must not be empty'),
  body('activityDate')
    .trim()
    .matches(DATE_ONLY_PATTERN)
    .withMessage('activityDate must be a calendar date in YYYY-MM-DD format')
    .bail()
    .isISO8601({ strict: true })
    .withMessage('activityDate must be a valid calendar date'),
  body('startTime')
    .optional({ nullable: true })
    .matches(TIME_ONLY_PATTERN)
    .withMessage('startTime must be in HH:MM (24h) format'),
  body('endTime')
    .optional({ nullable: true })
    .matches(TIME_ONLY_PATTERN)
    .withMessage('endTime must be in HH:MM (24h) format'),
  body('itemOrder').isInt({ min: 1 }).withMessage('itemOrder must be a positive integer').toInt(),
  body('notes')
    .optional()
    .isString()
    .withMessage('notes must be a string')
    .isLength({ max: 2000 })
    .withMessage('notes must be at most 2000 characters'),
];

// Partial update — every field optional. startTime/endTime ordering is
// re-checked in the service after merging with the existing item.
const updateItemValidation = [
  body('cityId').optional().trim().notEmpty().withMessage('cityId must not be empty'),
  body('activityId').optional({ nullable: true }).trim().notEmpty().withMessage('activityId must not be empty'),
  body('activityDate')
    .optional()
    .trim()
    .matches(DATE_ONLY_PATTERN)
    .withMessage('activityDate must be a calendar date in YYYY-MM-DD format')
    .bail()
    .isISO8601({ strict: true })
    .withMessage('activityDate must be a valid calendar date'),
  body('startTime')
    .optional({ nullable: true })
    .matches(TIME_ONLY_PATTERN)
    .withMessage('startTime must be in HH:MM (24h) format'),
  body('endTime')
    .optional({ nullable: true })
    .matches(TIME_ONLY_PATTERN)
    .withMessage('endTime must be in HH:MM (24h) format'),
  body('itemOrder').optional().isInt({ min: 1 }).withMessage('itemOrder must be a positive integer').toInt(),
  body('notes')
    .optional()
    .isString()
    .withMessage('notes must be a string')
    .isLength({ max: 2000 })
    .withMessage('notes must be at most 2000 characters'),
];

const reorderItemsValidation = [
  body('activityDate')
    .trim()
    .matches(DATE_ONLY_PATTERN)
    .withMessage('activityDate must be a calendar date in YYYY-MM-DD format'),
  body('itemIds').isArray({ min: 1 }).withMessage('itemIds must be a non-empty array'),
  body('itemIds.*')
    .isString()
    .withMessage('Each itemId must be a string')
    .trim()
    .notEmpty()
    .withMessage('Each itemId must not be empty'),
];

function requireAtLeastOneItemField(req, res, next) {
  const requestBody = req.body || {};
  const hasAny = UPDATABLE_ITEM_FIELDS.some((field) => Object.prototype.hasOwnProperty.call(requestBody, field));

  if (!hasAny) {
    return next(
      AppError.unprocessable('Provide at least one field to update', [
        { field: 'body', message: `At least one of ${UPDATABLE_ITEM_FIELDS.join(', ')} must be provided` },
      ])
    );
  }

  return next();
}

module.exports = {
  tripIdParamValidation,
  itemIdParamValidation,
  listItemsValidation,
  createItemValidation,
  updateItemValidation,
  reorderItemsValidation,
  requireAtLeastOneItemField,
};

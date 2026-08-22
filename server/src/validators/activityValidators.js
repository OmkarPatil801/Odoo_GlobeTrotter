const { param, query } = require('express-validator');

const activityIdParamValidation = [param('id').trim().notEmpty().withMessage('Activity id is required')];

const cityIdParamValidation = [param('cityId').trim().notEmpty().withMessage('City id is required')];

const costAndCategoryFilters = [
  query('category').optional().trim().isString(),
  query('minCost').optional().isFloat({ min: 0 }).withMessage('minCost must be a non-negative number').toFloat(),
  query('maxCost').optional().isFloat({ min: 0 }).withMessage('maxCost must be a non-negative number').toFloat(),
];

const listCityActivitiesValidation = [
  ...costAndCategoryFilters,
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer').toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100')
    .toInt(),
];

const searchActivitiesValidation = [
  query('q')
    .trim()
    .notEmpty()
    .withMessage('q is required')
    .isLength({ min: 2 })
    .withMessage('q must be at least 2 characters'),
  ...costAndCategoryFilters,
];

module.exports = {
  activityIdParamValidation,
  cityIdParamValidation,
  listCityActivitiesValidation,
  searchActivitiesValidation,
};

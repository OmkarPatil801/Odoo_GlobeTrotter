const { param, query } = require('express-validator');

const cityIdParamValidation = [param('id').trim().notEmpty().withMessage('City id is required')];

// countryCode/country/region/search are all optional filters — no
// hardcoded country/region list, any value is accepted and matched
// against the repository's data.
const listCitiesValidation = [
  query('search').optional().trim().isString(),
  query('countryCode')
    .optional()
    .trim()
    .isLength({ min: 2, max: 2 })
    .withMessage('countryCode must be a 2-letter ISO 3166-1 alpha-2 code'),
  query('country').optional().trim().isString(),
  query('region').optional().trim().isString(),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer').toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100')
    .toInt(),
];

const searchCitiesValidation = [
  query('q')
    .trim()
    .notEmpty()
    .withMessage('q is required')
    .isLength({ min: 2 })
    .withMessage('q must be at least 2 characters'),
];

module.exports = { cityIdParamValidation, listCitiesValidation, searchCitiesValidation };

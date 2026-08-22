const { body } = require('express-validator');
const AppError = require('../utils/appError');

// PUT /api/users/me supports partial updates, but at least one supported
// field must be present. Runs before the field-level checks below so a
// completely empty body fails fast with the same VALIDATION_ERROR shape.
function requireAtLeastOneUpdatableField(req, res, next) {
  const body = req.body || {};
  const hasName = Object.prototype.hasOwnProperty.call(body, 'name');
  const hasEmail = Object.prototype.hasOwnProperty.call(body, 'email');

  if (!hasName && !hasEmail) {
    return next(
      AppError.unprocessable('Provide at least one of name or email to update', [
        { field: 'body', message: 'At least one of name or email must be provided' },
      ])
    );
  }

  return next();
}

// Email format only — normalization happens in the service layer, same
// convention as registration.
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email').optional().trim().isEmail().withMessage('A valid email is required'),
];

module.exports = { requireAtLeastOneUpdatableField, updateProfileValidation };

const { body } = require('express-validator');
const AppError = require('../utils/appError');

const UPDATABLE_FIELDS = ['name', 'email', 'country', 'phone', 'profileImageUrl'];

// PUT /api/users/me supports partial updates, but at least one supported
// field must be present. Runs before the field-level checks below so a
// completely empty body fails fast with the same VALIDATION_ERROR shape.
function requireAtLeastOneUpdatableField(req, res, next) {
  const requestBody = req.body || {};
  const hasAny = UPDATABLE_FIELDS.some((field) => Object.prototype.hasOwnProperty.call(requestBody, field));

  if (!hasAny) {
    return next(
      AppError.unprocessable(`Provide at least one of ${UPDATABLE_FIELDS.join(', ')} to update`, [
        { field: 'body', message: `At least one of ${UPDATABLE_FIELDS.join(', ')} must be provided` },
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
  body('country')
    .optional({ nullable: true })
    .isString()
    .withMessage('Country must be a string')
    .isLength({ max: 100 })
    .withMessage('Country must be at most 100 characters'),
  body('phone')
    .optional({ nullable: true })
    .isString()
    .withMessage('Phone must be a string')
    .isLength({ max: 30 })
    .withMessage('Phone must be at most 30 characters'),
  body('profileImageUrl').optional({ nullable: true }).isString().withMessage('profileImageUrl must be a string'),
];

module.exports = { requireAtLeastOneUpdatableField, updateProfileValidation };

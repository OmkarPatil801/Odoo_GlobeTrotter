const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

// Validation infrastructure for future endpoints. Usage in a route:
//
//   const { body } = require('express-validator');
//   const { validate } = require('../validators');
//
//   router.post('/things', [body('name').isString().notEmpty()], validate, controller.create);
//
// `validate` collects any express-validator errors and forwards a single
// 422 AppError (VALIDATION_ERROR) to the centralized error handler — no
// business validation schemas are defined yet.
function validate(req, res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const details = result.array().map((issue) => ({
    field: issue.path,
    message: issue.msg,
  }));

  return next(AppError.unprocessable('Request validation failed', details));
}

module.exports = { validate };

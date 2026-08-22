const env = require('../config/env');
const AppError = require('../utils/appError');
const { error: sendError, HTTP_STATUS } = require('../utils/apiResponse');

// Centralized error handler. Every error in the app should end up here,
// either via next(err) or a thrown error inside an async handler that's
// been forwarded to next(). Always returns the standard error JSON shape
// and never leaks a stack trace to the client.
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // Full detail stays server-side only.
  console.error(`[error] ${req.method} ${req.originalUrl} ->`, err);

  // Known, expected application error.
  if (err instanceof AppError) {
    return sendError(res, {
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
      details: err.details,
    });
  }

  // express-validator (or similar) style error carrying a raw list of issues.
  if (Array.isArray(err.errors)) {
    return sendError(res, {
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: err.errors,
    });
  }

  // Malformed JSON body from express.json().
  if (err.type === 'entity.parse.failed') {
    return sendError(res, {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: 'BAD_REQUEST',
      message: 'Malformed JSON in request body',
    });
  }

  // Unknown/unexpected error — respond generically, never expose internals.
  return sendError(res, {
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: 'INTERNAL_ERROR',
    message: env.isProduction ? 'Internal Server Error' : (err.message || 'Internal Server Error'),
  });
}

module.exports = errorHandler;

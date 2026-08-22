const env = require('../config/env');
const AppError = require('../utils/appError');
const { error: sendError, HTTP_STATUS } = require('../utils/apiResponse');
const { logSecurityEvent } = require('../utils/securityLogger');

// Centralized error handler. Every error in the app should end up here,
// either via next(err) or a thrown error inside an async handler that's
// been forwarded to next(). Always returns the standard error JSON shape
// and never leaks a stack trace, internal error message, or any other
// implementation detail to the client — full detail is only ever logged
// server-side (console.error below, and the structured security event
// for the truly-unexpected branch), and that logging never includes the
// request body (which is where a password could otherwise end up).
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

  // Request body exceeded env.jsonBodyLimit (see app.js).
  if (err.type === 'entity.too.large') {
    return sendError(res, {
      statusCode: HTTP_STATUS.PAYLOAD_TOO_LARGE,
      code: 'PAYLOAD_TOO_LARGE',
      message: 'Request body is too large',
    });
  }

  // CORS origin rejection (see src/middleware/cors.js) already arrives as
  // an AppError and is handled above — nothing special needed here.

  // Unknown/unexpected error — respond generically, never expose
  // internals (stack trace, Prisma error text, file paths, etc.).
  logSecurityEvent('UNEXPECTED_SERVER_ERROR', { method: req.method, path: req.originalUrl, name: err.name });

  return sendError(res, {
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: 'INTERNAL_ERROR',
    message: env.isProduction ? 'Internal Server Error' : (err.message || 'Internal Server Error'),
  });
}

module.exports = errorHandler;

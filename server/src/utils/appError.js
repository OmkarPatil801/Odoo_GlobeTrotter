const HTTP_STATUS = require('./httpStatus');

// Operational (expected) errors — thrown/passed via next() by controllers/services,
// caught by src/middleware/errorHandler.js and turned into a consistent JSON response.
class AppError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, code = 'INTERNAL_ERROR', details) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad request', details) {
    return new AppError(message, HTTP_STATUS.BAD_REQUEST, 'BAD_REQUEST', details);
  }

  static unauthorized(message = 'Unauthorized', details) {
    return new AppError(message, HTTP_STATUS.UNAUTHORIZED, 'UNAUTHORIZED', details);
  }

  static forbidden(message = 'Forbidden', details) {
    return new AppError(message, HTTP_STATUS.FORBIDDEN, 'FORBIDDEN', details);
  }

  static notFound(message = 'Resource not found', details) {
    return new AppError(message, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', details);
  }

  static conflict(message = 'Conflict', details) {
    return new AppError(message, HTTP_STATUS.CONFLICT, 'CONFLICT', details);
  }

  static unprocessable(message = 'Validation failed', details) {
    return new AppError(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, 'VALIDATION_ERROR', details);
  }

  static tooManyRequests(message = 'Too many requests', details) {
    return new AppError(message, HTTP_STATUS.TOO_MANY_REQUESTS, 'RATE_LIMIT_EXCEEDED', details);
  }

  static internal(message = 'Internal server error', details) {
    return new AppError(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'INTERNAL_ERROR', details);
  }
}

module.exports = AppError;

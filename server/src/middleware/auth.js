const AppError = require('../utils/appError');
const { verifyToken } = require('../utils/jwt');

const AUTH_HEADER_PREFIX = 'Bearer ';

// Reads `Authorization: Bearer <token>`, verifies it, and attaches the
// authenticated identity to req.user (just the id — full user data is
// fetched from the repository by whichever route needs it, e.g. GET /me).
function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith(AUTH_HEADER_PREFIX)) {
    return next(AppError.unauthorized('Authentication token is required'));
  }

  const token = header.slice(AUTH_HEADER_PREFIX.length).trim();
  if (!token) {
    return next(AppError.unauthorized('Authentication token is required'));
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub };
    return next();
  } catch (err) {
    // Covers malformed tokens (JsonWebTokenError) and expired ones
    // (TokenExpiredError) with the same generic, consistent response.
    return next(AppError.unauthorized('Invalid or expired authentication token'));
  }
}

module.exports = authenticate;

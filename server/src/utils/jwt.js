const jwt = require('jsonwebtoken');
const env = require('../config/env');

// Payload is intentionally minimal — only what's needed to identify the
// user (`sub`). Never put password/passwordHash or other sensitive profile
// data in a JWT payload, since it's readable by anyone holding the token.
function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

// Throws (jsonwebtoken's TokenExpiredError / JsonWebTokenError / NotBeforeError)
// on an invalid, malformed, or expired token — callers decide how to map
// that to an HTTP response.
function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

module.exports = { signToken, verifyToken };

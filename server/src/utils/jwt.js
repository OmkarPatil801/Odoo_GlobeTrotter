const jwt = require('jsonwebtoken');
const env = require('../config/env');

// HMAC-SHA256 — a strong, well-supported signing algorithm for a
// single-secret setup like this one. Pinned explicitly (not left to
// jsonwebtoken's default) on both sign and verify so a token can never
// smuggle in a different algorithm than the one this app actually
// intends to trust (a well-known JWT vulnerability class: without an
// explicit `algorithms` allowlist on verify, a maliciously crafted token
// could otherwise request a different algorithm be used to check its
// signature).
const JWT_ALGORITHM = 'HS256';

// Payload is intentionally minimal — only what's needed to identify the
// user (`sub`). Never put password/passwordHash or other sensitive profile
// data in a JWT payload, since it's readable by anyone holding the token.
function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn, algorithm: JWT_ALGORITHM });
}

// Throws (jsonwebtoken's TokenExpiredError / JsonWebTokenError / NotBeforeError)
// on an invalid, malformed, or expired token, or one signed with an
// algorithm other than JWT_ALGORITHM — callers decide how to map that to
// an HTTP response. Never logs the token itself.
function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret, { algorithms: [JWT_ALGORITHM] });
}

module.exports = { signToken, verifyToken, JWT_ALGORITHM };

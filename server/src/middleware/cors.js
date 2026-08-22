const cors = require('cors');

const env = require('../config/env');
const AppError = require('../utils/appError');
const HTTP_STATUS = require('../utils/httpStatus');
const { logSecurityEvent } = require('../utils/securityLogger');

// CORS_ORIGIN supports a comma-separated allowlist, e.g.
//   CORS_ORIGIN=http://localhost:5173,https://app.globetrotter.example
// A bare "*" (development convenience only — env.js refuses it in
// production) allows any origin.
function parseAllowedOrigins(corsOrigin) {
  if (!corsOrigin) return [];
  return corsOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const allowedOrigins = parseAllowedOrigins(env.corsOrigin);
const allowAnyOrigin = allowedOrigins.includes('*');

function originCheck(origin, callback) {
  // No Origin header at all — same-origin requests, curl/Postman,
  // server-to-server calls, or mobile clients. Browsers always send
  // Origin on cross-origin requests, so allowing a missing header never
  // weakens the browser-enforced check below.
  if (!origin) return callback(null, true);

  if (allowAnyOrigin || allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  logSecurityEvent('CORS_ORIGIN_REJECTED', { origin });
  return callback(new AppError('Origin not allowed by CORS policy', HTTP_STATUS.FORBIDDEN, 'CORS_NOT_ALLOWED'));
}

// `credentials` is left at its default (false) — this API is a bearer-
// token API (Authorization header), not cookie-based, so there's no
// reason to send Access-Control-Allow-Credentials.
const corsMiddleware = cors({ origin: originCheck });

module.exports = corsMiddleware;

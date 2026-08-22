const rateLimit = require('express-rate-limit');

const env = require('../config/env');
const { error: sendError, HTTP_STATUS } = require('../utils/apiResponse');
const { logSecurityEvent } = require('../utils/securityLogger');

// In-memory store (express-rate-limit's default) — fine for a single
// server instance. If/when this deploys as multiple instances behind a
// load balancer, each instance would track its own counters, so the
// *effective* limit becomes (per-instance limit x instance count). At
// that point, swap the store for a shared one (e.g. a Redis-backed
// rate-limit store) — deliberately not done here per the brief for this
// project's current single-instance deployment.
function rateLimitHandler(req, res) {
  logSecurityEvent('RATE_LIMIT_EXCEEDED', { ip: req.ip, method: req.method, path: req.originalUrl });

  return sendError(res, {
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests. Please try again later.',
  });
}

// Shared factory so every limiter in this file (and tests) is built the
// same way — standard rate-limit headers, the app's existing error
// envelope on 429, and skipped automatically during the Jest suite
// (NODE_ENV=test) so ordinary functional tests hitting an endpoint
// repeatedly don't trip it. `skip` can be overridden (e.g. by a
// dedicated rate-limit test that wants to exercise real 429 behavior).
function createLimiter({ windowMs, max, skip = () => env.isTest }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
    skip,
  });
}

// General API limiter — mounted once, globally, ahead of all routes.
const generalLimiter = createLimiter({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
});

// Stricter limits for the two endpoints most attractive to abuse:
// account-creation spam and credential-stuffing / brute-force login.
const registerLimiter = createLimiter({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.registerMax,
});

const loginLimiter = createLimiter({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.loginMax,
});

module.exports = { generalLimiter, registerLimiter, loginLimiter, createLimiter };

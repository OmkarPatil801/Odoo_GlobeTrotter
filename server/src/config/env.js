require('dotenv').config();

// Single source of truth for environment/configuration values.
// No other module should read `process.env` directly — add new
// settings here (e.g. DB_*) as they're needed later.
const nodeEnv = process.env.NODE_ENV || 'development';
const isTest = nodeEnv === 'test';
const isProduction = nodeEnv === 'production';

// Secrets that must never sign a real JWT — catches the .env.example
// placeholder and other common weak defaults being copy-pasted straight
// into a real deployment. Not exhaustive; length is the primary guard.
const WEAK_JWT_SECRETS = new Set([
  'secret',
  'changeme',
  'change-me',
  'password',
  'jwt-secret',
  'your-secret-here',
  'test-only-jwt-secret',
  'replace-with-a-long-random-secret',
]);
const MIN_JWT_SECRET_LENGTH = 32;

function parseIntEnv(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

const env = {
  nodeEnv,
  port: process.env.PORT || 5000,
  // No wildcard fallback in production — see the fail-fast check below.
  corsOrigin: process.env.CORS_ORIGIN || (isProduction ? undefined : '*'),
  // No fallback secret outside tests — a real deployment must set this
  // explicitly via .env (see .env.example). Jest sets NODE_ENV=test, so
  // the test suite can run without requiring a local .env file.
  jwtSecret: process.env.JWT_SECRET || (isTest ? 'test-only-jwt-secret' : undefined),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || (isProduction ? undefined : '1h'),
  // Prisma also reads DATABASE_URL directly via env() in schema.prisma —
  // that's fine, this is just the app-code access point for the same var.
  databaseUrl: process.env.DATABASE_URL,
};

env.isProduction = isProduction;
env.isDevelopment = nodeEnv === 'development';
env.isTest = isTest;

// The ONE place the app decides in-memory vs. Prisma repositories (see
// src/repositories/index.js). Tests always get in-memory, even if a
// DATABASE_URL happens to be set in the environment they run in — the
// suite must never require a live MySQL connection.
env.useDatabase = Boolean(env.databaseUrl) && !env.isTest;

// Rate limiting — same "single access point" convention as everything
// else here. See src/middleware/rateLimiter.js for how these are used.
// Defaults match the documented targets: 100 general requests / 15 min /
// IP, 5 registrations / 15 min / IP, 10 login attempts / 15 min / IP.
env.rateLimit = {
  windowMs: parseIntEnv(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  max: parseIntEnv(process.env.RATE_LIMIT_MAX, 100),
  registerMax: parseIntEnv(process.env.RATE_LIMIT_REGISTER_MAX, 5),
  loginMax: parseIntEnv(process.env.RATE_LIMIT_LOGIN_MAX, 10),
};

// Express JSON body size limit (see app.js). 100kb comfortably covers
// every current request shape (auth, profile, trip/trip-stop payloads).
env.jsonBodyLimit = process.env.JSON_BODY_LIMIT || '100kb';

// --- Fail-fast startup validation ---
// Tests always run with NODE_ENV=test and get the safe hardcoded
// fallbacks above — none of the checks below ever run for the suite.

if (!env.jwtSecret) {
  throw new Error('JWT_SECRET environment variable is required. Copy .env.example to .env and set a value.');
}

if (isProduction) {
  // NODE_ENV itself is trivially satisfied by reaching this branch —
  // listed here only to document that it's a required production var too.
  const missingVars = [];
  if (!process.env.JWT_SECRET) missingVars.push('JWT_SECRET');
  if (!process.env.JWT_EXPIRES_IN) missingVars.push('JWT_EXPIRES_IN');
  if (!process.env.CORS_ORIGIN) missingVars.push('CORS_ORIGIN');
  if (!process.env.DATABASE_URL) missingVars.push('DATABASE_URL');

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required production environment variable(s): ${missingVars.join(', ')}. ` +
        'See .env.example — production must configure all of these explicitly, with no insecure fallback.'
    );
  }

  if (env.jwtSecret.length < MIN_JWT_SECRET_LENGTH || WEAK_JWT_SECRETS.has(env.jwtSecret.toLowerCase())) {
    throw new Error(
      `JWT_SECRET is too weak for production (must be a random string of at least ${MIN_JWT_SECRET_LENGTH} characters, not a common/default value). ` +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\""
    );
  }

  if (env.corsOrigin.trim() === '*') {
    throw new Error(
      'CORS_ORIGIN must not be "*" in production. Set it to a comma-separated allowlist of trusted origins.'
    );
  }
}

module.exports = env;

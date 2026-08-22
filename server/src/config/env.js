require('dotenv').config();

// Single source of truth for environment/configuration values.
// No other module should read `process.env` directly — add new
// settings here (e.g. DB_*) as they're needed later.
const nodeEnv = process.env.NODE_ENV || 'development';
const isTest = nodeEnv === 'test';

const env = {
  nodeEnv,
  port: process.env.PORT || 5000,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  // No fallback secret outside tests — a real deployment must set this
  // explicitly via .env (see .env.example). Jest sets NODE_ENV=test, so
  // the test suite can run without requiring a local .env file.
  jwtSecret: process.env.JWT_SECRET || (isTest ? 'test-only-jwt-secret' : undefined),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  // Prisma also reads DATABASE_URL directly via env() in schema.prisma —
  // that's fine, this is just the app-code access point for the same var.
  databaseUrl: process.env.DATABASE_URL,
};

env.isProduction = nodeEnv === 'production';
env.isDevelopment = nodeEnv === 'development';
env.isTest = isTest;

// The ONE place the app decides in-memory vs. Prisma repositories (see
// src/repositories/index.js). Tests always get in-memory, even if a
// DATABASE_URL happens to be set in the environment they run in — the
// suite must never require a live MySQL connection.
env.useDatabase = Boolean(env.databaseUrl) && !env.isTest;

if (!env.jwtSecret) {
  throw new Error(
    'JWT_SECRET environment variable is required. Copy .env.example to .env and set a value.'
  );
}

module.exports = env;

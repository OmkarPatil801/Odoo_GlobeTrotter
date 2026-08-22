// Production-configuration security tests. These deliberately simulate
// NODE_ENV=production by setting process.env and forcing a fresh module
// registry (jest.resetModules()) before each require — env.js, cors.js,
// etc. all read process.env at module-load time, so a fresh require is
// required to pick up the simulated production config. process.env is
// always restored afterward so nothing leaks into other test files that
// might share this Jest worker.
const ORIGINAL_ENV = { ...process.env };

function setProductionEnv(overrides = {}) {
  process.env.NODE_ENV = 'production';
  process.env.JWT_SECRET = 'a'.repeat(48);
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.CORS_ORIGIN = 'https://trusted-app.example.com';
  process.env.DATABASE_URL = 'mysql://user:pass@localhost:3306/globetrotter';
  Object.assign(process.env, overrides);
}

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  jest.resetModules();
});

describe('Production environment validation (fail-fast)', () => {
  it('boots successfully with a complete, valid production configuration', () => {
    jest.resetModules();
    setProductionEnv();

    expect(() => require('../src/config/env')).not.toThrow();
  });

  it('refuses to boot with CORS_ORIGIN=*', () => {
    jest.resetModules();
    setProductionEnv({ CORS_ORIGIN: '*' });

    expect(() => require('../src/config/env')).toThrow(/CORS_ORIGIN must not be "\*"/);
  });

  it('refuses to boot with a short/weak JWT_SECRET', () => {
    jest.resetModules();
    setProductionEnv({ JWT_SECRET: 'changeme' });

    expect(() => require('../src/config/env')).toThrow(/JWT_SECRET is too weak/);
  });

  it('refuses to boot with the .env.example placeholder secret, even though it is 34 characters long', () => {
    jest.resetModules();
    // Long enough to pass the length check alone — must still be caught
    // by the known-weak-value check, since it's the literal placeholder
    // shipped in .env.example and easy to accidentally leave in place.
    setProductionEnv({ JWT_SECRET: 'replace-with-a-long-random-secret' });

    expect(() => require('../src/config/env')).toThrow(/JWT_SECRET is too weak/);
  });

  it('refuses to boot when JWT_SECRET/CORS_ORIGIN/DATABASE_URL/JWT_EXPIRES_IN are missing', () => {
    jest.resetModules();
    process.env.NODE_ENV = 'production';
    delete process.env.JWT_SECRET;
    delete process.env.JWT_EXPIRES_IN;
    delete process.env.CORS_ORIGIN;
    delete process.env.DATABASE_URL;

    expect(() => require('../src/config/env')).toThrow(/Missing required production environment variable/);
  });
});

describe('CORS origin allowlist (production configuration)', () => {
  it('rejects an unknown origin and allows the configured one', async () => {
    jest.resetModules();
    setProductionEnv({ CORS_ORIGIN: 'https://trusted-app.example.com' });

    const express = require('express');
    const request = require('supertest');
    const corsMiddleware = require('../src/middleware/cors');
    const errorHandler = require('../src/middleware/errorHandler');

    const testApp = express();
    testApp.use(corsMiddleware);
    testApp.get('/ping', (req, res) => res.json({ success: true, data: {} }));
    testApp.use(errorHandler);

    const rejected = await request(testApp).get('/ping').set('Origin', 'https://evil.example.com');
    expect(rejected.statusCode).toBe(403);
    expect(rejected.body.success).toBe(false);
    expect(rejected.body.error.code).toBe('CORS_NOT_ALLOWED');

    const allowed = await request(testApp).get('/ping').set('Origin', 'https://trusted-app.example.com');
    expect(allowed.statusCode).toBe(200);
    expect(allowed.headers['access-control-allow-origin']).toBe('https://trusted-app.example.com');
  });

  it('supports a comma-separated allowlist of multiple trusted origins', async () => {
    jest.resetModules();
    setProductionEnv({ CORS_ORIGIN: 'https://a.example.com,https://b.example.com' });

    const express = require('express');
    const request = require('supertest');
    const corsMiddleware = require('../src/middleware/cors');

    const testApp = express();
    testApp.use(corsMiddleware);
    testApp.get('/ping', (req, res) => res.json({ success: true, data: {} }));
    testApp.use(require('../src/middleware/errorHandler'));

    const first = await request(testApp).get('/ping').set('Origin', 'https://a.example.com');
    const second = await request(testApp).get('/ping').set('Origin', 'https://b.example.com');

    expect(first.statusCode).toBe(200);
    expect(second.statusCode).toBe(200);
  });

  it('still handles CORS preflight (OPTIONS) requests for an allowed origin', async () => {
    jest.resetModules();
    setProductionEnv({ CORS_ORIGIN: 'https://trusted-app.example.com' });

    const express = require('express');
    const request = require('supertest');
    const corsMiddleware = require('../src/middleware/cors');

    const testApp = express();
    testApp.use(corsMiddleware);
    testApp.put('/ping', (req, res) => res.json({ success: true, data: {} }));

    const res = await request(testApp)
      .options('/ping')
      .set('Origin', 'https://trusted-app.example.com')
      .set('Access-Control-Request-Method', 'PUT');

    expect(res.statusCode).toBeLessThan(300);
    expect(res.headers['access-control-allow-origin']).toBe('https://trusted-app.example.com');
  });

  it('allows requests with no Origin header (server-to-server, curl) regardless of allowlist', async () => {
    jest.resetModules();
    setProductionEnv({ CORS_ORIGIN: 'https://trusted-app.example.com' });

    const express = require('express');
    const request = require('supertest');
    const corsMiddleware = require('../src/middleware/cors');

    const testApp = express();
    testApp.use(corsMiddleware);
    testApp.get('/ping', (req, res) => res.json({ success: true, data: {} }));

    const res = await request(testApp).get('/ping');
    expect(res.statusCode).toBe(200);
  });
});

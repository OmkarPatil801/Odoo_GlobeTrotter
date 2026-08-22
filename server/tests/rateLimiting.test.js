// Dedicated rate-limit test, isolated in its own file/tiny app so
// hammering an endpoint here can't trip the shared limiter state used by
// (or interfere with) any other test file. Uses the real createLimiter
// factory from src/middleware/rateLimiter.js with skip forced off, so
// this exercises the actual production code path, not a reimplementation.
const express = require('express');
const request = require('supertest');

const { createLimiter } = require('../src/middleware/rateLimiter');
const errorHandler = require('../src/middleware/errorHandler');

describe('Rate limiting', () => {
  it('allows requests under the limit, then returns 429 with the standard error envelope', async () => {
    const testApp = express();
    const limiter = createLimiter({ windowMs: 60_000, max: 2, skip: () => false });
    testApp.get('/api/ping', limiter, (req, res) => res.json({ success: true, data: {} }));
    testApp.use(errorHandler);

    const first = await request(testApp).get('/api/ping');
    const second = await request(testApp).get('/api/ping');
    const third = await request(testApp).get('/api/ping');

    expect(first.statusCode).toBe(200);
    expect(second.statusCode).toBe(200);
    expect(third.statusCode).toBe(429);
    expect(third.body).toEqual({
      success: false,
      error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again later.' },
    });
  });

  it('sets standard RateLimit-* response headers', async () => {
    const testApp = express();
    const limiter = createLimiter({ windowMs: 60_000, max: 5, skip: () => false });
    testApp.get('/api/ping', limiter, (req, res) => res.json({ success: true, data: {} }));
    testApp.use(errorHandler);

    const res = await request(testApp).get('/api/ping');

    expect(res.headers['ratelimit-limit']).toBe('5');
    expect(res.headers['ratelimit-remaining']).toBeDefined();
  });

  it('is skipped by default under the test environment (NODE_ENV=test) so ordinary tests are unaffected', async () => {
    const testApp = express();
    const limiter = createLimiter({ windowMs: 60_000, max: 1 }); // default skip: () => env.isTest
    testApp.get('/api/ping', limiter, (req, res) => res.json({ success: true, data: {} }));
    testApp.use(errorHandler);

    const first = await request(testApp).get('/api/ping');
    const second = await request(testApp).get('/api/ping');
    const third = await request(testApp).get('/api/ping');

    expect(first.statusCode).toBe(200);
    expect(second.statusCode).toBe(200);
    expect(third.statusCode).toBe(200);
  });
});

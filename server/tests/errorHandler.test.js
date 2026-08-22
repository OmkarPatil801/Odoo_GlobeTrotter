const express = require('express');
const request = require('supertest');

const AppError = require('../src/utils/appError');
const errorHandler = require('../src/middleware/errorHandler');

// Isolated app just for exercising the error handler — keeps test-only
// routes out of src/app.js.
function buildTestApp() {
  const app = express();

  app.get('/known-error', (req, res, next) => {
    next(AppError.conflict('Resource already exists', { field: 'email' }));
  });

  app.get('/unknown-error', () => {
    throw new Error('boom');
  });

  app.use(errorHandler);
  return app;
}

describe('errorHandler', () => {
  it('formats a known AppError with its own status code and details', async () => {
    const res = await request(buildTestApp()).get('/known-error');

    expect(res.statusCode).toBe(409);
    expect(res.body).toEqual({
      success: false,
      error: {
        code: 'CONFLICT',
        message: 'Resource already exists',
        details: { field: 'email' },
      },
    });
  });

  it('does not leak stack traces for unknown errors', async () => {
    const res = await request(buildTestApp()).get('/unknown-error');

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
    expect(res.body.error.stack).toBeUndefined();
    expect(JSON.stringify(res.body)).not.toMatch(/at buildTestApp|node_modules/);
  });
});

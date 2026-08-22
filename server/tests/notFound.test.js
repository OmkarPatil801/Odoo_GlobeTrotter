const request = require('supertest');
const app = require('../src/app');

describe('Unknown API routes', () => {
  it('returns a 404 with the standard error envelope', async () => {
    const res = await request(app).get('/api/does-not-exist');

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
      },
    });
  });
});

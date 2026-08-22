const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
  it('returns 200 with the standard success envelope', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.status).toBe('ok');
    expect(typeof res.body.data.timestamp).toBe('string');
  });
});

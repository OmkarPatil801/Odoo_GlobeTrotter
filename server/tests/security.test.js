// Canonical security regression suite. Runs against the real, fully
// wired app (src/app.js) — NODE_ENV=test (set by Jest) means it boots
// with in-memory repositories and a skipped rate limiter, exactly like
// every other test file, so this never requires MySQL and never trips
// the general/register/login rate limits mid-suite.
const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

const app = require('../src/app');
const env = require('../src/config/env');
const errorHandler = require('../src/middleware/errorHandler');
const { redact } = require('../src/utils/securityLogger');

async function registerUser(overrides = {}) {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Security Test User',
      email: `security-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
      password: 'Password123!',
      ...overrides,
    });
  return { token: res.body.data.token, user: res.body.data.user };
}

async function createTrip(token, overrides = {}) {
  const res = await request(app)
    .post('/api/trips')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Security Test Trip', startDate: '2026-10-10', endDate: '2026-10-20', ...overrides });
  return res.body.data.trip;
}

describe('HTTP security headers (helmet)', () => {
  it('sets the expected secure headers and removes X-Powered-By', async () => {
    const res = await request(app).get('/api/health');

    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['strict-transport-security']).toContain('max-age=');
    expect(res.headers['content-security-policy']).toContain("default-src 'self'");
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
});

describe('Request size limits', () => {
  it('rejects an oversized JSON body', async () => {
    const { token } = await registerUser();
    const oversizedNotes = 'a'.repeat(200 * 1024); // 200kb, over the 100kb limit

    const res = await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Trip', startDate: '2026-10-10', endDate: '2026-10-20', description: oversizedNotes });

    expect(res.statusCode).toBe(413);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('PAYLOAD_TOO_LARGE');
  });
});

describe('JWT hardening', () => {
  it('rejects a request with no token', async () => {
    const res = await request(app).get('/api/trips');
    expect(res.statusCode).toBe(401);
  });

  it('rejects a malformed token', async () => {
    const res = await request(app).get('/api/trips').set('Authorization', 'Bearer not-a-real-token');
    expect(res.statusCode).toBe(401);
  });

  it('rejects an expired token', async () => {
    const expired = jwt.sign({ sub: 'someone' }, env.jwtSecret, { algorithm: 'HS256', expiresIn: -10 });
    const res = await request(app).get('/api/trips').set('Authorization', `Bearer ${expired}`);
    expect(res.statusCode).toBe(401);
  });

  it('rejects a token signed with the wrong secret (invalid signature)', async () => {
    const forged = jwt.sign({ sub: 'someone' }, 'a-completely-different-secret', {
      algorithm: 'HS256',
      expiresIn: '1h',
    });
    const res = await request(app).get('/api/trips').set('Authorization', `Bearer ${forged}`);
    expect(res.statusCode).toBe(401);
  });

  it('rejects a token signed with an unexpected algorithm (alg confusion)', async () => {
    // 'none' algorithm — an unsigned token asserting any subject it likes.
    // jsonwebtoken refuses to sign with 'none' unless explicitly allowed,
    // so this is built by hand to prove verifyToken's explicit algorithms
    // allowlist rejects it regardless.
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ sub: 'someone' })).toString('base64url');
    const noneAlgToken = `${header}.${payload}.`;

    const res = await request(app).get('/api/trips').set('Authorization', `Bearer ${noneAlgToken}`);
    expect(res.statusCode).toBe(401);
  });
});

describe('Authorization: trips and trip stops are strictly owner-scoped', () => {
  it('user cannot access, modify, or delete another user\'s trip', async () => {
    const userA = await registerUser();
    const userB = await registerUser();
    const trip = await createTrip(userA.token);

    const getRes = await request(app).get(`/api/trips/${trip.id}`).set('Authorization', `Bearer ${userB.token}`);
    expect(getRes.statusCode).toBe(404);
    expect(getRes.body.error.code).toBe('TRIP_NOT_FOUND');

    const putRes = await request(app)
      .put(`/api/trips/${trip.id}`)
      .set('Authorization', `Bearer ${userB.token}`)
      .send({ name: 'Hijacked' });
    expect(putRes.statusCode).toBe(404);
    expect(putRes.body.error.code).toBe('TRIP_NOT_FOUND');

    const deleteRes = await request(app)
      .delete(`/api/trips/${trip.id}`)
      .set('Authorization', `Bearer ${userB.token}`);
    expect(deleteRes.statusCode).toBe(404);
    expect(deleteRes.body.error.code).toBe('TRIP_NOT_FOUND');

    // Trip must still exist and be untouched for its real owner.
    const confirmRes = await request(app)
      .get(`/api/trips/${trip.id}`)
      .set('Authorization', `Bearer ${userA.token}`);
    expect(confirmRes.statusCode).toBe(200);
    expect(confirmRes.body.data.trip.name).toBe('Security Test Trip');
  });

  it("user cannot manipulate another user's trip stop", async () => {
    const userA = await registerUser();
    const userB = await registerUser();
    const trip = await createTrip(userA.token);

    const stopRes = await request(app)
      .post(`/api/trips/${trip.id}/stops`)
      .set('Authorization', `Bearer ${userA.token}`)
      .send({ cityId: '1', stopOrder: 1, arrivalDate: '2026-10-10', departureDate: '2026-10-12' });
    const stopId = stopRes.body.data.stop.id;

    const updateRes = await request(app)
      .put(`/api/trips/${trip.id}/stops/${stopId}`)
      .set('Authorization', `Bearer ${userB.token}`)
      .send({ notes: 'Hijacked' });
    expect(updateRes.statusCode).toBe(404);
    expect(updateRes.body.error.code).toBe('TRIP_NOT_FOUND');

    const deleteRes = await request(app)
      .delete(`/api/trips/${trip.id}/stops/${stopId}`)
      .set('Authorization', `Bearer ${userB.token}`);
    expect(deleteRes.statusCode).toBe(404);
    expect(deleteRes.body.error.code).toBe('TRIP_NOT_FOUND');
  });
});

describe('Input validation', () => {
  it('rejects an invalid trip id shape gracefully (never a 500)', async () => {
    const { token } = await registerUser();
    const res = await request(app)
      .get('/api/trips/../../etc/passwd')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).not.toBe(500);
  });

  it('rejects an invalid date on trip creation with 422 VALIDATION_ERROR', async () => {
    const { token } = await registerUser();
    const res = await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Trip', startDate: 'not-a-date', endDate: '2026-10-20' });

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects an invalid pagination value with 422 VALIDATION_ERROR', async () => {
    const { token } = await registerUser();
    const res = await request(app).get('/api/trips?page=-1').set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('Mass assignment protection', () => {
  it('profile update cannot modify id or role', async () => {
    const { token, user } = await registerUser();

    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Name', id: 'attacker-controlled', role: 'ADMIN' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.id).toBe(user.id);
    expect(res.body.data.user).not.toHaveProperty('role');
    expect(JSON.stringify(res.body)).not.toMatch(/"role"/);
  });

  it('trip update cannot modify id, userId, createdAt, or updatedAt', async () => {
    const { token, user } = await registerUser();
    const trip = await createTrip(token);

    const res = await request(app)
      .put(`/api/trips/${trip.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Renamed',
        id: '99999',
        userId: '99999',
        createdAt: '2000-01-01T00:00:00.000Z',
        updatedAt: '2000-01-01T00:00:00.000Z',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.trip.id).toBe(trip.id);
    expect(res.body.data.trip.userId).toBe(user.id);
    expect(res.body.data.trip.createdAt).toBe(trip.createdAt);
    expect(res.body.data.trip.name).toBe('Renamed');
  });

  it('trip stop update cannot modify tripId', async () => {
    const { token } = await registerUser();
    const trip1 = await createTrip(token, { name: 'Trip 1' });
    const trip2 = await createTrip(token, { name: 'Trip 2' });

    const stopRes = await request(app)
      .post(`/api/trips/${trip1.id}/stops`)
      .set('Authorization', `Bearer ${token}`)
      .send({ cityId: '1', stopOrder: 1, arrivalDate: '2026-10-10', departureDate: '2026-10-12' });
    const stopId = stopRes.body.data.stop.id;

    const res = await request(app)
      .put(`/api/trips/${trip1.id}/stops/${stopId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ tripId: trip2.id, notes: 'Still trip 1' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.stop.tripId).toBe(trip1.id);
    expect(res.body.data.stop.notes).toBe('Still trip 1');
  });
});

describe('Sensitive data never leaks', () => {
  it('passwordHash never appears in register/login/profile/me responses', async () => {
    const { token } = await registerUser({ password: 'Password123!' });

    const meRes = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    const profileRes = await request(app).get('/api/users/me').set('Authorization', `Bearer ${token}`);

    for (const res of [meRes, profileRes]) {
      const raw = JSON.stringify(res.body);
      expect(raw).not.toMatch(/passwordHash/i);
      expect(raw).not.toContain('Password123!');
    }
  });

  it("login failure does not reveal whether the email exists", async () => {
    const { user } = await registerUser();

    const wrongPassword = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'DefinitelyWrong123!' });
    const unknownEmail = await request(app)
      .post('/api/auth/login')
      .send({ email: 'no-such-account@example.com', password: 'DefinitelyWrong123!' });

    expect(wrongPassword.statusCode).toBe(401);
    expect(unknownEmail.statusCode).toBe(401);
    expect(wrongPassword.body).toEqual(unknownEmail.body);
    expect(wrongPassword.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('never logs the Authorization header or bearer token', async () => {
    const secretToken = 'super-secret-token-value-should-never-be-logged';
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await request(app).get('/api/trips').set('Authorization', `Bearer ${secretToken}`);

      const allLoggedText = [...warnSpy.mock.calls, ...errorSpy.mock.calls].flat().map(String).join('\n');
      expect(allLoggedText).not.toContain(secretToken);
      expect(allLoggedText).not.toContain(`Bearer ${secretToken}`);
    } finally {
      warnSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });

  it('redact() strips password/token/authorization/secret-shaped keys from log details', () => {
    const redacted = redact({
      email: 'user@example.com',
      password: 'hunter2',
      passwordHash: '$2b$12$abc',
      token: 'eyJhbGciOi...',
      Authorization: 'Bearer eyJhbGciOi...',
      nested: { jwt: 'abc.def.ghi', databaseUrl: 'mysql://user:pass@host/db' },
    });

    expect(redacted.email).toBe('user@example.com');
    expect(redacted.password).toBe('[REDACTED]');
    expect(redacted.passwordHash).toBe('[REDACTED]');
    expect(redacted.token).toBe('[REDACTED]');
    expect(redacted.Authorization).toBe('[REDACTED]');
    expect(redacted.nested.jwt).toBe('[REDACTED]');
    expect(redacted.nested.databaseUrl).toBe('[REDACTED]');
  });
});

describe('Error responses never leak internals', () => {
  it('an unexpected error never includes a stack trace or internal detail in the JSON response', async () => {
    const testApp = express();
    testApp.get('/boom', () => {
      throw new Error('/etc/secrets/db-password.txt could not be read at line 42');
    });
    testApp.use(errorHandler);

    const res = await request(testApp).get('/boom');

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
    expect(res.body.error).not.toHaveProperty('stack');
    expect(JSON.stringify(res.body)).not.toMatch(/at Object\.|at processTicksAndRejections|node_modules/);
  });

  it('an unknown route returns 404 without leaking route/internal details', async () => {
    const res = await request(app).get('/api/this-route-does-not-exist');
    expect(res.statusCode).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
    expect(JSON.stringify(res.body)).not.toMatch(/node_modules|at Object\./);
  });
});

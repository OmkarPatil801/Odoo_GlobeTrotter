const request = require('supertest');
const jwt = require('jsonwebtoken');

const buildAuthApp = require('./helpers/buildAuthApp');
const env = require('../src/config/env');

const VALID_USER = {
  name: 'Demo User',
  email: 'demo@example.com',
  password: 'Password123!',
};

function registerValidUser(app, overrides = {}) {
  return request(app)
    .post('/api/auth/register')
    .send({ ...VALID_USER, ...overrides });
}

describe('POST /api/auth/register', () => {
  it('registers a new user and returns a sanitized user + token', async () => {
    const { app } = buildAuthApp();
    const res = await registerValidUser(app);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toMatchObject({
      name: 'Demo User',
      email: 'demo@example.com',
    });
    expect(res.body.data.user.id).toBeDefined();
    expect(typeof res.body.data.token).toBe('string');
  });

  it('rejects an invalid email format', async () => {
    const { app } = buildAuthApp();
    const res = await registerValidUser(app, { email: 'not-an-email' });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects missing required fields', async () => {
    const { app } = buildAuthApp();
    const res = await request(app).post('/api/auth/register').send({ email: 'demo@example.com' });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(Array.isArray(res.body.error.details)).toBe(true);
  });

  it('rejects a password that is too short', async () => {
    const { app } = buildAuthApp();
    const res = await registerValidUser(app, { password: 'short' });

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects a duplicate email with 409', async () => {
    const { app } = buildAuthApp();

    await registerValidUser(app);
    const res = await registerValidUser(app, { name: 'Someone Else' });

    expect(res.statusCode).toBe(409);
    expect(res.body).toEqual({
      success: false,
      error: {
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'An account with this email already exists',
      },
    });
  });

  it('normalizes email case so duplicates are still caught', async () => {
    const { app } = buildAuthApp();

    await registerValidUser(app);
    const res = await registerValidUser(app, { email: 'DEMO@EXAMPLE.COM', name: 'Someone Else' });

    expect(res.statusCode).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with correct credentials', async () => {
    const { app } = buildAuthApp();
    await registerValidUser(app);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_USER.email, password: VALID_USER.password });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(VALID_USER.email);
    expect(typeof res.body.data.token).toBe('string');
  });

  it('rejects an incorrect password with generic 401', async () => {
    const { app } = buildAuthApp();
    await registerValidUser(app);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_USER.email, password: 'WrongPassword1!' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
    });
  });

  it('rejects a nonexistent email with the same generic 401', async () => {
    const { app } = buildAuthApp();

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'WhoKnows123!' });

    expect(res.statusCode).toBe(401);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('rejects an invalid login request (missing password)', async () => {
    const { app } = buildAuthApp();

    const res = await request(app).post('/api/auth/login').send({ email: VALID_USER.email });

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('JWT authentication middleware (via GET /api/auth/me)', () => {
  it('accepts a valid token', async () => {
    const { app } = buildAuthApp();
    const { body } = await registerValidUser(app);

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${body.data.token}`);

    expect(res.statusCode).toBe(200);
  });

  it('rejects a request with no token', async () => {
    const { app } = buildAuthApp();
    const res = await request(app).get('/api/auth/me');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects a malformed token', async () => {
    const { app } = buildAuthApp();
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer not-a-real-token');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects an expired token', async () => {
    const { app } = buildAuthApp();
    const expiredToken = jwt.sign({ sub: 'some-user-id' }, env.jwtSecret, { expiresIn: -10 });

    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${expiredToken}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/auth/me', () => {
  it('returns the authenticated user', async () => {
    const { app } = buildAuthApp();
    const { body } = await registerValidUser(app);

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${body.data.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      data: {
        user: {
          name: VALID_USER.name,
          email: VALID_USER.email,
        },
      },
    });
  });

  it('rejects an unauthenticated request', async () => {
    const { app } = buildAuthApp();
    const res = await request(app).get('/api/auth/me');

    expect(res.statusCode).toBe(401);
  });

  it('returns 404 if the user no longer exists', async () => {
    const { app } = buildAuthApp();
    const validToken = jwt.sign({ sub: 'does-not-exist' }, env.jwtSecret, { expiresIn: '1h' });

    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error.code).toBe('USER_NOT_FOUND');
  });
});

describe('Security: sensitive data never leaks', () => {
  it('never includes password or passwordHash in the register response', async () => {
    const { app } = buildAuthApp();
    const res = await registerValidUser(app);

    const raw = JSON.stringify(res.body);
    expect(res.body.data.user.password).toBeUndefined();
    expect(res.body.data.user.passwordHash).toBeUndefined();
    expect(raw).not.toMatch(/passwordHash/i);
    expect(raw).not.toContain(VALID_USER.password);
  });

  it('never includes password or passwordHash in the login response', async () => {
    const { app } = buildAuthApp();
    await registerValidUser(app);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: VALID_USER.email, password: VALID_USER.password });

    const raw = JSON.stringify(res.body);
    expect(res.body.data.user.passwordHash).toBeUndefined();
    expect(raw).not.toMatch(/passwordHash/i);
    expect(raw).not.toContain(VALID_USER.password);
  });

  it('does not embed password information inside the JWT payload', async () => {
    const { app } = buildAuthApp();
    const { body } = await registerValidUser(app);

    const decoded = jwt.decode(body.data.token);

    expect(decoded).toHaveProperty('sub');
    expect(decoded.password).toBeUndefined();
    expect(decoded.passwordHash).toBeUndefined();
    expect(decoded.email).toBeUndefined();
    expect(decoded.name).toBeUndefined();
  });
});

const request = require('supertest');
const jwt = require('jsonwebtoken');

const buildApp = require('./helpers/buildApp');
const env = require('../src/config/env');

async function registerUser(app, overrides = {}) {
  const payload = {
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'Password123!',
    ...overrides,
  };
  const res = await request(app).post('/api/auth/register').send(payload);
  return { token: res.body.data.token, user: res.body.data.user, password: payload.password };
}

describe('GET /api/users/me', () => {
  it('lets an authenticated user retrieve their profile', async () => {
    const { app } = buildApp();
    const { token, user } = await registerUser(app);

    const res = await request(app).get('/api/users/me').set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });
  });

  it('returns 401 when the token is missing', async () => {
    const { app } = buildApp();
    const res = await request(app).get('/api/users/me');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 when the token is invalid', async () => {
    const { app } = buildApp();
    const res = await request(app).get('/api/users/me').set('Authorization', 'Bearer not-a-real-token');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 404 if the authenticated user no longer exists', async () => {
    const { app } = buildApp();
    const token = jwt.sign({ sub: 'does-not-exist' }, env.jwtSecret, { expiresIn: '1h' });

    const res = await request(app).get('/api/users/me').set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error.code).toBe('USER_NOT_FOUND');
  });

  it('never returns passwordHash', async () => {
    const { app } = buildApp();
    const { token } = await registerUser(app);

    const res = await request(app).get('/api/users/me').set('Authorization', `Bearer ${token}`);

    expect(res.body.data.user.passwordHash).toBeUndefined();
    expect(JSON.stringify(res.body)).not.toMatch(/passwordHash/i);
  });
});

describe('PUT /api/users/me', () => {
  it('updates the name', async () => {
    const { app } = buildApp();
    const { token } = await registerUser(app);

    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Omkar Patil' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.name).toBe('Omkar Patil');
    expect(res.body.data.user.email).toBe('demo@example.com');
  });

  it('updates the email (normalized to lowercase)', async () => {
    const { app } = buildApp();
    const { token } = await registerUser(app);

    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'NEW@Example.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.email).toBe('new@example.com');
  });

  it('updates both name and email together', async () => {
    const { app } = buildApp();
    const { token } = await registerUser(app);

    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Omkar Patil', email: 'omkar@example.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.user).toMatchObject({ name: 'Omkar Patil', email: 'omkar@example.com' });
  });

  it('rejects an invalid email with 422', async () => {
    const { app } = buildApp();
    const { token } = await registerUser(app);

    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'not-an-email' });

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects an invalid name with 422', async () => {
    const { app } = buildApp();
    const { token } = await registerUser(app);

    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'A' });

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects an empty update body with 422', async () => {
    const { app } = buildApp();
    const { token } = await registerUser(app);

    const res = await request(app).put('/api/users/me').set('Authorization', `Bearer ${token}`).send({});

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects updating to an email already owned by another user with 409', async () => {
    const { app } = buildApp();
    await registerUser(app, { email: 'taken@example.com' });
    const { token } = await registerUser(app, { email: 'demo2@example.com' });

    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'taken@example.com' });

    expect(res.statusCode).toBe(409);
    expect(res.body).toEqual({
      success: false,
      error: {
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'An account with this email already exists',
      },
    });
  });

  it('ignores an id/userId in the body — it cannot be changed', async () => {
    const { app } = buildApp();
    const { token, user } = await registerUser(app);

    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ id: 'hacked-id', userId: 'hacked-id', name: 'New Name' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.id).toBe(user.id);
  });

  it('ignores a passwordHash in the body — it cannot be changed', async () => {
    const { app } = buildApp();
    const { token, password } = await registerUser(app);

    const updateRes = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ passwordHash: 'attacker-controlled-hash', name: 'New Name' });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.data.user.passwordHash).toBeUndefined();

    // Original password must still work — proves passwordHash was not
    // overwritten by the request body.
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'demo@example.com', password });

    expect(loginRes.statusCode).toBe(200);
  });

  it("cannot access or modify another user's profile", async () => {
    const { app } = buildApp();
    const userA = await registerUser(app, { email: 'user-a@example.com', name: 'User A' });
    const userB = await registerUser(app, { email: 'user-b@example.com', name: 'User B' });

    await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${userB.token}`)
      .send({ name: 'User B Updated' });

    const res = await request(app).get('/api/users/me').set('Authorization', `Bearer ${userA.token}`);

    expect(res.body.data.user.name).toBe('User A');
    expect(res.body.data.user.email).toBe('user-a@example.com');
  });
});

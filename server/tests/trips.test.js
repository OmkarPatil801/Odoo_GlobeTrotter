const request = require('supertest');
const buildTripsApp = require('./helpers/buildTripsApp');

const VALID_TRIP = {
  name: 'Japan Adventure',
  description: 'Tokyo and Kyoto trip',
  startDate: '2026-10-10',
  endDate: '2026-10-20',
  coverImageUrl: 'https://images.example.com/japan.jpg',
};

async function registerUser(app, overrides = {}) {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Demo User', email: 'demo@example.com', password: 'Password123!', ...overrides });
  return { token: res.body.data.token, userId: res.body.data.user.id };
}

function createTripRequest(app, token, overrides = {}) {
  return request(app)
    .post('/api/trips')
    .set('Authorization', `Bearer ${token}`)
    .send({ ...VALID_TRIP, ...overrides });
}

describe('POST /api/trips', () => {
  it('creates a trip for the authenticated user', async () => {
    const { app } = buildTripsApp();
    const { token, userId } = await registerUser(app);

    const res = await createTripRequest(app, token);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.trip).toMatchObject({
      name: VALID_TRIP.name,
      startDate: VALID_TRIP.startDate,
      endDate: VALID_TRIP.endDate,
      status: 'PLANNED',
      isPublic: false,
    });
    expect(res.body.data.trip.userId).toBe(userId);
    expect(res.body.data.trip.id).toBeDefined();
  });

  it('requires authentication', async () => {
    const { app } = buildTripsApp();
    const res = await request(app).post('/api/trips').send(VALID_TRIP);

    expect(res.statusCode).toBe(401);
  });

  it('takes userId from the JWT, ignoring any userId supplied in the body', async () => {
    const { app } = buildTripsApp();
    const { token, userId } = await registerUser(app);

    const res = await createTripRequest(app, token, { userId: '9999' });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.trip.userId).toBe(userId);
    expect(res.body.data.trip.userId).not.toBe('9999');
  });

  it('rejects an invalid date range (endDate before startDate)', async () => {
    const { app } = buildTripsApp();
    const { token } = await registerUser(app);

    const res = await createTripRequest(app, token, { startDate: '2026-10-20', endDate: '2026-10-10' });

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('GET /api/trips', () => {
  it("lists only the authenticated user's trips", async () => {
    const { app } = buildTripsApp();
    const userA = await registerUser(app, { email: 'a@example.com' });
    const userB = await registerUser(app, { email: 'b@example.com' });

    await createTripRequest(app, userA.token, { name: 'Trip A1' });
    await createTripRequest(app, userA.token, { name: 'Trip A2' });
    await createTripRequest(app, userB.token, { name: 'Trip B1' });

    const res = await request(app).get('/api/trips').set('Authorization', `Bearer ${userA.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data.every((trip) => trip.userId === userA.userId)).toBe(true);
    expect(res.body.data.some((trip) => trip.name === 'Trip B1')).toBe(false);
  });

  it('paginates results using the standard meta shape', async () => {
    const { app } = buildTripsApp();
    const { token } = await registerUser(app);

    for (let i = 0; i < 5; i += 1) {
      await createTripRequest(app, token, { name: `Trip ${i}` });
    }

    const res = await request(app).get('/api/trips?page=1&limit=2').set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta).toEqual({ page: 1, limit: 2, total: 5, totalPages: 3 });
  });
});

describe('GET /api/trips/:id', () => {
  it('returns the trip when owned by the authenticated user', async () => {
    const { app } = buildTripsApp();
    const { token } = await registerUser(app);
    const created = await createTripRequest(app, token);
    const tripId = created.body.data.trip.id;

    const res = await request(app).get(`/api/trips/${tripId}`).set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.trip.id).toBe(tripId);
  });

  it("returns 404 TRIP_NOT_FOUND for another user's trip", async () => {
    const { app } = buildTripsApp();
    const userA = await registerUser(app, { email: 'a@example.com' });
    const userB = await registerUser(app, { email: 'b@example.com' });
    const created = await createTripRequest(app, userA.token);
    const tripId = created.body.data.trip.id;

    const res = await request(app).get(`/api/trips/${tripId}`).set('Authorization', `Bearer ${userB.token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error.code).toBe('TRIP_NOT_FOUND');
  });
});

describe('PUT /api/trips/:id', () => {
  it('updates a trip owned by the authenticated user', async () => {
    const { app } = buildTripsApp();
    const { token } = await registerUser(app);
    const created = await createTripRequest(app, token);
    const tripId = created.body.data.trip.id;

    const res = await request(app)
      .put(`/api/trips/${tripId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name', status: 'ONGOING', isPublic: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.trip).toMatchObject({ name: 'Updated Name', status: 'ONGOING', isPublic: true });
  });

  it("cannot update another user's trip", async () => {
    const { app } = buildTripsApp();
    const userA = await registerUser(app, { email: 'a@example.com' });
    const userB = await registerUser(app, { email: 'b@example.com' });
    const created = await createTripRequest(app, userA.token);
    const tripId = created.body.data.trip.id;

    const res = await request(app)
      .put(`/api/trips/${tripId}`)
      .set('Authorization', `Bearer ${userB.token}`)
      .send({ name: 'Hijacked' });

    expect(res.statusCode).toBe(404);
    expect(res.body.error.code).toBe('TRIP_NOT_FOUND');
  });

  it('rejects an invalid status', async () => {
    const { app } = buildTripsApp();
    const { token } = await registerUser(app);
    const created = await createTripRequest(app, token);
    const tripId = created.body.data.trip.id;

    const res = await request(app)
      .put(`/api/trips/${tripId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'FINISHED' });

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('re-validates the date range after a partial update', async () => {
    const { app } = buildTripsApp();
    const { token } = await registerUser(app);
    const created = await createTripRequest(app, token, { startDate: '2026-10-10', endDate: '2026-10-20' });
    const tripId = created.body.data.trip.id;

    const res = await request(app)
      .put(`/api/trips/${tripId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ startDate: '2026-11-01' }); // now after the existing (untouched) endDate

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('DELETE /api/trips/:id', () => {
  it('deletes a trip owned by the authenticated user', async () => {
    const { app } = buildTripsApp();
    const { token } = await registerUser(app);
    const created = await createTripRequest(app, token);
    const tripId = created.body.data.trip.id;

    const res = await request(app).delete(`/api/trips/${tripId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);

    const getRes = await request(app).get(`/api/trips/${tripId}`).set('Authorization', `Bearer ${token}`);
    expect(getRes.statusCode).toBe(404);
  });

  it("cannot delete another user's trip", async () => {
    const { app } = buildTripsApp();
    const userA = await registerUser(app, { email: 'a@example.com' });
    const userB = await registerUser(app, { email: 'b@example.com' });
    const created = await createTripRequest(app, userA.token);
    const tripId = created.body.data.trip.id;

    const res = await request(app).delete(`/api/trips/${tripId}`).set('Authorization', `Bearer ${userB.token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error.code).toBe('TRIP_NOT_FOUND');

    const getRes = await request(app).get(`/api/trips/${tripId}`).set('Authorization', `Bearer ${userA.token}`);
    expect(getRes.statusCode).toBe(200);
  });
});

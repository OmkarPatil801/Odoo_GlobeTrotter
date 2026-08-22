const request = require('supertest');
const buildTripsApp = require('./helpers/buildTripsApp');

const VALID_TRIP = {
  name: 'Japan Adventure',
  startDate: '2026-10-10',
  endDate: '2026-10-20',
};

async function registerUser(app, overrides = {}) {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Demo User', email: 'demo@example.com', password: 'Password123!', ...overrides });
  return { token: res.body.data.token, userId: res.body.data.user.id };
}

async function createTrip(app, token, overrides = {}) {
  const res = await request(app)
    .post('/api/trips')
    .set('Authorization', `Bearer ${token}`)
    .send({ ...VALID_TRIP, ...overrides });
  return res.body.data.trip;
}

function createStopRequest(app, token, tripId, overrides = {}) {
  return request(app)
    .post(`/api/trips/${tripId}/stops`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      cityId: '1',
      stopOrder: 1,
      arrivalDate: '2026-10-10',
      departureDate: '2026-10-13',
      notes: 'Explore Tokyo',
      ...overrides,
    });
}

describe('POST /api/trips/:tripId/stops', () => {
  it('creates a stop for a trip the user owns', async () => {
    const { app } = buildTripsApp();
    const { token } = await registerUser(app);
    const trip = await createTrip(app, token);

    const res = await createStopRequest(app, token, trip.id);

    expect(res.statusCode).toBe(201);
    expect(res.body.data.stop).toMatchObject({
      tripId: trip.id,
      cityId: '1',
      stopOrder: 1,
      notes: 'Explore Tokyo',
    });
  });

  it('requires trip ownership', async () => {
    const { app } = buildTripsApp();
    const userA = await registerUser(app, { email: 'a@example.com' });
    const userB = await registerUser(app, { email: 'b@example.com' });
    const trip = await createTrip(app, userA.token);

    const res = await createStopRequest(app, userB.token, trip.id);

    expect(res.statusCode).toBe(404);
    expect(res.body.error.code).toBe('TRIP_NOT_FOUND');
  });

  it('requires the referenced city to exist', async () => {
    const { app } = buildTripsApp();
    const { token } = await registerUser(app);
    const trip = await createTrip(app, token);

    const res = await createStopRequest(app, token, trip.id, { cityId: '9999' });

    expect(res.statusCode).toBe(404);
    expect(res.body.error.code).toBe('CITY_NOT_FOUND');
  });

  it('rejects an invalid date range (departureDate before arrivalDate)', async () => {
    const { app } = buildTripsApp();
    const { token } = await registerUser(app);
    const trip = await createTrip(app, token);

    const res = await createStopRequest(app, token, trip.id, {
      arrivalDate: '2026-10-13',
      departureDate: '2026-10-10',
    });

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects an invalid stopOrder', async () => {
    const { app } = buildTripsApp();
    const { token } = await registerUser(app);
    const trip = await createTrip(app, token);

    const res = await createStopRequest(app, token, trip.id, { stopOrder: 0 });

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('GET /api/trips/:tripId/stops', () => {
  it('lists stops ordered by stopOrder ascending', async () => {
    const { app } = buildTripsApp();
    const { token } = await registerUser(app);
    const trip = await createTrip(app, token);

    await createStopRequest(app, token, trip.id, {
      cityId: '1',
      stopOrder: 2,
      arrivalDate: '2026-10-14',
      departureDate: '2026-10-16',
    });
    await createStopRequest(app, token, trip.id, {
      cityId: '2',
      stopOrder: 1,
      arrivalDate: '2026-10-10',
      departureDate: '2026-10-13',
    });

    const res = await request(app).get(`/api/trips/${trip.id}/stops`).set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.map((stop) => stop.stopOrder)).toEqual([1, 2]);
    expect(res.body.data[0].cityId).toBe('2');
    expect(res.body.data[0].city).toBeDefined();
  });
});

describe('PUT /api/trips/:tripId/stops/:stopId', () => {
  it('updates a stop', async () => {
    const { app } = buildTripsApp();
    const { token } = await registerUser(app);
    const trip = await createTrip(app, token);
    const created = await createStopRequest(app, token, trip.id);
    const stopId = created.body.data.stop.id;

    const res = await request(app)
      .put(`/api/trips/${trip.id}/stops/${stopId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ notes: 'Updated notes' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.stop.notes).toBe('Updated notes');
  });
});

describe('DELETE /api/trips/:tripId/stops/:stopId', () => {
  it('deletes a stop', async () => {
    const { app } = buildTripsApp();
    const { token } = await registerUser(app);
    const trip = await createTrip(app, token);
    const created = await createStopRequest(app, token, trip.id);
    const stopId = created.body.data.stop.id;

    const res = await request(app)
      .delete(`/api/trips/${trip.id}/stops/${stopId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);

    const listRes = await request(app).get(`/api/trips/${trip.id}/stops`).set('Authorization', `Bearer ${token}`);
    expect(listRes.body.data).toHaveLength(0);
  });

  it("cannot manipulate another user's trip stop", async () => {
    const { app } = buildTripsApp();
    const userA = await registerUser(app, { email: 'a@example.com' });
    const userB = await registerUser(app, { email: 'b@example.com' });
    const trip = await createTrip(app, userA.token);
    const created = await createStopRequest(app, userA.token, trip.id);
    const stopId = created.body.data.stop.id;

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

describe('PUT /api/trips/:tripId/stops/reorder', () => {
  async function setupThreeStops(app, token, tripId) {
    const s1 = await createStopRequest(app, token, tripId, {
      cityId: '1',
      stopOrder: 1,
      arrivalDate: '2026-10-10',
      departureDate: '2026-10-12',
    });
    const s2 = await createStopRequest(app, token, tripId, {
      cityId: '2',
      stopOrder: 2,
      arrivalDate: '2026-10-12',
      departureDate: '2026-10-14',
    });
    const s3 = await createStopRequest(app, token, tripId, {
      cityId: '3',
      stopOrder: 3,
      arrivalDate: '2026-10-14',
      departureDate: '2026-10-16',
    });
    return [s1.body.data.stop, s2.body.data.stop, s3.body.data.stop];
  }

  it('reorders stops and maintains sequential ordering', async () => {
    const { app } = buildTripsApp();
    const { token } = await registerUser(app);
    const trip = await createTrip(app, token);
    const [s1, s2, s3] = await setupThreeStops(app, token, trip.id);

    const res = await request(app)
      .put(`/api/trips/${trip.id}/stops/reorder`)
      .set('Authorization', `Bearer ${token}`)
      .send({ stopIds: [s3.id, s1.id, s2.id] });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.map((stop) => stop.id)).toEqual([s3.id, s1.id, s2.id]);
    expect(res.body.data.map((stop) => stop.stopOrder)).toEqual([1, 2, 3]);
  });

  it('rejects duplicate stop ids', async () => {
    const { app } = buildTripsApp();
    const { token } = await registerUser(app);
    const trip = await createTrip(app, token);
    const [s1, s2] = await setupThreeStops(app, token, trip.id);

    const res = await request(app)
      .put(`/api/trips/${trip.id}/stops/reorder`)
      .set('Authorization', `Bearer ${token}`)
      .send({ stopIds: [s1.id, s1.id, s2.id] });

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects a request missing one of the existing stop ids', async () => {
    const { app } = buildTripsApp();
    const { token } = await registerUser(app);
    const trip = await createTrip(app, token);
    const [s1, s2] = await setupThreeStops(app, token, trip.id);

    const res = await request(app)
      .put(`/api/trips/${trip.id}/stops/reorder`)
      .set('Authorization', `Bearer ${token}`)
      .send({ stopIds: [s1.id, s2.id] }); // missing s3

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects a stopIds list containing an id from another trip', async () => {
    const { app } = buildTripsApp();
    const { token } = await registerUser(app);
    const trip1 = await createTrip(app, token, { name: 'Trip 1' });
    const trip2 = await createTrip(app, token, { name: 'Trip 2' });
    const [s1, s2] = await setupThreeStops(app, token, trip1.id);
    const otherStop = await createStopRequest(app, token, trip2.id);

    const res = await request(app)
      .put(`/api/trips/${trip1.id}/stops/reorder`)
      .set('Authorization', `Bearer ${token}`)
      .send({ stopIds: [otherStop.body.data.stop.id, s1.id, s2.id] });

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

const request = require('supertest');
const buildCitiesApp = require('./helpers/buildCitiesApp');

describe('GET /api/cities/:cityId/activities', () => {
  it('lists activities for a city with pagination meta', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/cities/1/activities');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data.every((activity) => activity.cityId === '1')).toBe(true);
    expect(res.body.meta).toMatchObject({ page: 1, limit: 20 });
  });

  it('filters by category', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/cities/1/activities?category=MUSEUM');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data.every((activity) => activity.category === 'MUSEUM')).toBe(true);
  });

  it('filters by cost range', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/cities/1/activities?minCost=20&maxCost=30');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data.every((activity) => activity.cost >= 20 && activity.cost <= 30)).toBe(true);
  });

  it('rejects invalid filters with 422', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/cities/1/activities?minCost=cheap');

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('GET /api/activities/search', () => {
  it('finds activities by name', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/activities/search?q=museum');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data.every((activity) => activity.name.toLowerCase().includes('museum'))).toBe(true);
  });
});

describe('GET /api/activities/:id', () => {
  it('returns a single activity', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/activities/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.activity).toMatchObject({ id: '1', cityId: '1', name: 'Louvre Museum Tour' });
  });

  it('returns 404 for an activity that does not exist', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/activities/9999');

    expect(res.statusCode).toBe(404);
    expect(res.body.error.code).toBe('ACTIVITY_NOT_FOUND');
  });

  it('returns 404 (not a 500) for a malformed id', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/activities/not-an-id');

    expect(res.statusCode).toBe(404);
    expect(res.body.error.code).toBe('ACTIVITY_NOT_FOUND');
  });
});

describe('Global requirements', () => {
  it('supports countryCode filtering across multiple countries', async () => {
    const { app } = buildCitiesApp();
    const fr = await request(app).get('/api/cities?countryCode=FR');
    const jp = await request(app).get('/api/cities?countryCode=JP');

    expect(fr.body.data.some((city) => city.name === 'Paris')).toBe(true);
    expect(jp.body.data.some((city) => city.name === 'Tokyo')).toBe(true);
  });

  it('does not hardcode a single currency across activities', async () => {
    const { app } = buildCitiesApp();
    const paris = await request(app).get('/api/cities/1/activities');
    const tokyo = await request(app).get('/api/cities/2/activities');

    const currencies = new Set([
      ...paris.body.data.map((activity) => activity.currencyCode),
      ...tokyo.body.data.map((activity) => activity.currencyCode),
    ]);

    expect(currencies.has('EUR')).toBe(true);
    expect(currencies.has('JPY')).toBe(true);
    expect(currencies.size).toBeGreaterThan(1);
  });

  it('does not hardcode a single timezone across cities', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/cities');

    const timezones = new Set(res.body.data.map((city) => city.timezone));
    expect(timezones.size).toBeGreaterThan(1);
    expect([...timezones].every((tz) => tz.includes('/'))).toBe(true);
  });
});

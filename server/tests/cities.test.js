const request = require('supertest');
const buildCitiesApp = require('./helpers/buildCitiesApp');

describe('GET /api/cities', () => {
  it('lists cities with pagination meta', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/cities');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta.page).toBe(1);
    expect(res.body.meta.limit).toBe(20);
    expect(res.body.meta.total).toBeGreaterThan(0);
    expect(res.body.meta.totalPages).toBeGreaterThan(0);
  });

  it('paginates results', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/cities?page=1&limit=3');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(3);
    expect(res.body.meta).toMatchObject({ page: 1, limit: 3 });
    expect(res.body.meta.totalPages).toBe(Math.ceil(res.body.meta.total / 3));
  });

  it('filters by countryCode', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/cities?countryCode=FR');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data.every((city) => city.countryCode === 'FR')).toBe(true);
    expect(res.body.data.some((city) => city.name === 'Paris')).toBe(true);
  });

  it('filters by region', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/cities?region=Africa');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    expect(res.body.data.every((city) => city.region === 'Africa')).toBe(true);
  });

  it('filters by search', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/cities?search=Par');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.some((city) => city.name === 'Paris')).toBe(true);
  });

  it('rejects invalid pagination with 422', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/cities?page=0&limit=-1');

    expect(res.statusCode).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('GET /api/cities/search', () => {
  it('finds cities matching the query', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/cities/search?q=par');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.some((city) => city.name === 'Paris')).toBe(true);
  });

  it('is case-insensitive', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/cities/search?q=ToKyO');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.some((city) => city.name === 'Tokyo')).toBe(true);
  });

  it('rejects a missing or too-short query with 422', async () => {
    const { app } = buildCitiesApp();
    const missing = await request(app).get('/api/cities/search');
    const tooShort = await request(app).get('/api/cities/search?q=a');

    expect(missing.statusCode).toBe(422);
    expect(missing.body.error.code).toBe('VALIDATION_ERROR');
    expect(tooShort.statusCode).toBe(422);
  });
});

describe('GET /api/cities/:id', () => {
  it('returns a single city', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/cities/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.city).toMatchObject({ id: '1', name: 'Paris', countryCode: 'FR', region: 'Europe' });
    expect(typeof res.body.data.city.latitude).toBe('number');
    expect(typeof res.body.data.city.longitude).toBe('number');
    expect(res.body.data.city.timezone).toBe('Europe/Paris');
  });

  it('returns 404 for a city that does not exist', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/cities/9999');

    expect(res.statusCode).toBe(404);
    expect(res.body.error.code).toBe('CITY_NOT_FOUND');
  });

  it('returns 404 (not a 500) for a malformed id', async () => {
    const { app } = buildCitiesApp();
    const res = await request(app).get('/api/cities/not-an-id');

    expect(res.statusCode).toBe(404);
    expect(res.body.error.code).toBe('CITY_NOT_FOUND');
  });
});

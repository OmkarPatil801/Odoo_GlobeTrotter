// Unit tests for the Prisma-backed repositories against a fake Prisma
// client (no real database, no @prisma/client query engine involved) —
// verifying the id string<->number conversion, Decimal normalization,
// and Prisma error-code mapping the real MySQL connection will exercise
// later. These run as part of the normal suite; they never touch MySQL.
const createPrismaUserRepository = require('../src/repositories/prisma/userRepository.prisma');
const createPrismaCityRepository = require('../src/repositories/prisma/cityRepository.prisma');
const createPrismaActivityRepository = require('../src/repositories/prisma/activityRepository.prisma');

// Mimics a Prisma `Decimal` value closely enough for decimalToNumber()'s
// duck-typing (see src/utils/decimal.js) without depending on decimal.js.
function fakeDecimal(value) {
  return { toNumber: () => value };
}

function prismaError(code) {
  const err = new Error(`Prisma error ${code}`);
  err.code = code;
  return err;
}

describe('Prisma UserRepository', () => {
  it('converts a string id to a number for the query and back to a string in the result', async () => {
    const findUnique = jest.fn().mockResolvedValue({
      id: 42,
      name: 'Demo User',
      email: 'demo@example.com',
      passwordHash: 'hash',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    const repo = createPrismaUserRepository({ user: { findUnique } });

    const user = await repo.findUserById('42');

    expect(findUnique).toHaveBeenCalledWith({ where: { id: 42 } });
    expect(user.id).toBe('42');
    expect(typeof user.id).toBe('string');
    expect(user.createdAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('returns null (not an error) for a non-numeric id, without querying Prisma', async () => {
    const findUnique = jest.fn();
    const repo = createPrismaUserRepository({ user: { findUnique } });

    const user = await repo.findUserById('not-an-id');

    expect(user).toBeNull();
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('looks up by email unconverted', async () => {
    const findUnique = jest.fn().mockResolvedValue(null);
    const repo = createPrismaUserRepository({ user: { findUnique } });

    const user = await repo.findUserByEmail('demo@example.com');

    expect(findUnique).toHaveBeenCalledWith({ where: { email: 'demo@example.com' } });
    expect(user).toBeNull();
  });

  it('maps a unique-constraint violation on create to 409 EMAIL_ALREADY_EXISTS', async () => {
    const create = jest.fn().mockRejectedValue(prismaError('P2002'));
    const repo = createPrismaUserRepository({ user: { create } });

    await expect(
      repo.createUser({ name: 'Demo', email: 'demo@example.com', passwordHash: 'hash' })
    ).rejects.toMatchObject({ statusCode: 409, code: 'EMAIL_ALREADY_EXISTS' });
  });

  it('maps a unique-constraint violation on update to 409 EMAIL_ALREADY_EXISTS', async () => {
    const update = jest.fn().mockRejectedValue(prismaError('P2002'));
    const repo = createPrismaUserRepository({ user: { update } });

    await expect(repo.updateUser('1', { email: 'taken@example.com' })).rejects.toMatchObject({
      statusCode: 409,
      code: 'EMAIL_ALREADY_EXISTS',
    });
  });

  it('maps a record-not-found error on update to null', async () => {
    const update = jest.fn().mockRejectedValue(prismaError('P2025'));
    const repo = createPrismaUserRepository({ user: { update } });

    const result = await repo.updateUser('9999', { name: 'Ghost' });

    expect(result).toBeNull();
  });
});

describe('Prisma CityRepository', () => {
  it('normalizes Decimal latitude/longitude to plain numbers and id to a string', async () => {
    const findUnique = jest.fn().mockResolvedValue({
      id: 7,
      name: 'Paris',
      country: 'France',
      countryCode: 'FR',
      region: 'Europe',
      latitude: fakeDecimal(48.8566),
      longitude: fakeDecimal(2.3522),
      timezone: 'Europe/Paris',
      description: 'The City of Light',
      imageUrl: 'https://example.com/paris.jpg',
    });
    const repo = createPrismaCityRepository({ city: { findUnique } });

    const city = await repo.findCityById('7');

    expect(city.id).toBe('7');
    expect(city.latitude).toBe(48.8566);
    expect(city.longitude).toBe(2.3522);
    expect(typeof city.latitude).toBe('number');
  });

  it('applies search/countryCode/pagination filters and returns total for meta', async () => {
    const findMany = jest.fn().mockResolvedValue([]);
    const count = jest.fn().mockResolvedValue(37);
    const repo = createPrismaCityRepository({ city: { findMany, count } });

    const { total } = await repo.listCities({ search: 'par', countryCode: 'fr', page: 2, limit: 10 });

    expect(total).toBe(37);
    const where = findMany.mock.calls[0][0].where;
    expect(where.name).toEqual({ contains: 'par' });
    expect(where.countryCode).toBe('FR');
    expect(findMany.mock.calls[0][0].skip).toBe(10);
    expect(findMany.mock.calls[0][0].take).toBe(10);
  });
});

describe('Prisma ActivityRepository', () => {
  it('maps durationHours to duration and normalizes cost, converting ids to strings', async () => {
    const findUnique = jest.fn().mockResolvedValue({
      id: 3,
      cityId: 7,
      name: 'Louvre Museum Tour',
      category: 'MUSEUM',
      description: 'Guided tour',
      durationHours: fakeDecimal(3),
      cost: fakeDecimal(25),
      currencyCode: 'EUR',
      imageUrl: 'https://example.com/louvre.jpg',
    });
    const repo = createPrismaActivityRepository({ activity: { findUnique } });

    const activity = await repo.findActivityById('3');

    expect(activity.id).toBe('3');
    expect(activity.cityId).toBe('7');
    expect(activity.duration).toBe(3);
    expect(activity.cost).toBe(25);
    expect(activity.currencyCode).toBe('EUR');
  });

  it('builds a cost range filter for listActivitiesByCity', async () => {
    const findMany = jest.fn().mockResolvedValue([]);
    const count = jest.fn().mockResolvedValue(0);
    const repo = createPrismaActivityRepository({ activity: { findMany, count } });

    await repo.listActivitiesByCity('7', { minCost: 10, maxCost: 50, category: 'MUSEUM', page: 1, limit: 20 });

    const where = findMany.mock.calls[0][0].where;
    expect(where.cityId).toBe(7);
    expect(where.category).toBe('MUSEUM');
    expect(where.cost).toEqual({ gte: 10, lte: 50 });
  });

  it('returns an empty page (not an error) for a non-numeric cityId', async () => {
    const findMany = jest.fn();
    const count = jest.fn();
    const repo = createPrismaActivityRepository({ activity: { findMany, count } });

    const result = await repo.listActivitiesByCity('not-an-id', {});

    expect(result).toEqual({ items: [], total: 0 });
    expect(findMany).not.toHaveBeenCalled();
  });
});

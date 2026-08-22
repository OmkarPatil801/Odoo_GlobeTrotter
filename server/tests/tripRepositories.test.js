// Repository-level tests for Trip/TripStop: id conversion for the
// in-memory implementations, and row mapping (including the reorder
// transaction strategy) for the Prisma implementations against a mocked
// client — no real database involved.
const createInMemoryTripRepository = require('../src/repositories/inMemoryTripRepository');
const createInMemoryTripStopRepository = require('../src/repositories/inMemoryTripStopRepository');
const createPrismaTripRepository = require('../src/repositories/prisma/tripRepository.prisma');
const createPrismaTripStopRepository = require('../src/repositories/prisma/tripStopRepository.prisma');

describe('In-memory TripRepository — id conversion', () => {
  it('returns string ids/userId and null for a non-numeric id', async () => {
    const repo = createInMemoryTripRepository();
    const trip = await repo.createTrip('7', { name: 'Trip', startDate: '2026-10-10', endDate: '2026-10-20' });

    expect(typeof trip.id).toBe('string');
    expect(trip.userId).toBe('7');

    const found = await repo.findTripById(trip.id);
    expect(found.id).toBe(trip.id);

    expect(await repo.findTripById('not-an-id')).toBeNull();
  });
});

describe('In-memory TripStopRepository — id conversion', () => {
  it('returns string ids and null for a non-numeric id', async () => {
    const repo = createInMemoryTripStopRepository();
    const stop = await repo.createStop('3', {
      cityId: '1',
      stopOrder: 1,
      arrivalDate: '2026-10-10',
      departureDate: '2026-10-12',
    });

    expect(typeof stop.id).toBe('string');
    expect(stop.tripId).toBe('3');
    expect(stop.cityId).toBe('1');

    expect(await repo.findStopById('not-an-id')).toBeNull();
  });
});

describe('Prisma TripRepository — row mapping', () => {
  it('maps numeric ids and Date columns to the API shape', async () => {
    const findUnique = jest.fn().mockResolvedValue({
      id: 5,
      userId: 9,
      name: 'Japan Adventure',
      description: 'Tokyo and Kyoto',
      startDate: new Date('2026-10-10T00:00:00.000Z'),
      endDate: new Date('2026-10-20T00:00:00.000Z'),
      coverImageUrl: null,
      status: 'PLANNED',
      isPublic: false,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    const repo = createPrismaTripRepository({ trip: { findUnique } });

    const trip = await repo.findTripById('5');

    expect(findUnique).toHaveBeenCalledWith({ where: { id: 5 } });
    expect(trip.id).toBe('5');
    expect(trip.userId).toBe('9');
    expect(trip.startDate).toBe('2026-10-10');
    expect(trip.endDate).toBe('2026-10-20');
    expect(trip.createdAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('returns null (not an error) for a non-numeric id, without querying Prisma', async () => {
    const findUnique = jest.fn();
    const repo = createPrismaTripRepository({ trip: { findUnique } });

    expect(await repo.findTripById('not-an-id')).toBeNull();
    expect(findUnique).not.toHaveBeenCalled();
  });
});

describe('Prisma TripStopRepository — row mapping and reorder transaction', () => {
  it('maps numeric ids and Date columns to the API shape', async () => {
    const findUnique = jest.fn().mockResolvedValue({
      id: 2,
      tripId: 5,
      cityId: 1,
      stopOrder: 1,
      arrivalDate: new Date('2026-10-10T00:00:00.000Z'),
      departureDate: new Date('2026-10-12T00:00:00.000Z'),
      notes: 'Explore',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    const repo = createPrismaTripStopRepository({ tripStop: { findUnique } });

    const stop = await repo.findStopById('2');

    expect(stop.id).toBe('2');
    expect(stop.tripId).toBe('5');
    expect(stop.cityId).toBe('1');
    expect(stop.arrivalDate).toBe('2026-10-10');
    expect(stop.departureDate).toBe('2026-10-12');
  });

  it('reorders via a transaction using temporary negative stopOrder values to avoid intermediate unique-constraint collisions', async () => {
    const updateCalls = [];
    const now = new Date('2026-01-01T00:00:00.000Z');
    const tx = {
      tripStop: {
        update: jest.fn(({ where, data }) => {
          updateCalls.push({ id: where.id, stopOrder: data.stopOrder });
          return Promise.resolve({});
        }),
        findMany: jest.fn().mockResolvedValue([
          { id: 30, tripId: 5, cityId: 1, stopOrder: 1, arrivalDate: null, departureDate: null, notes: null, createdAt: now, updatedAt: now },
          { id: 10, tripId: 5, cityId: 2, stopOrder: 2, arrivalDate: null, departureDate: null, notes: null, createdAt: now, updatedAt: now },
          { id: 20, tripId: 5, cityId: 3, stopOrder: 3, arrivalDate: null, departureDate: null, notes: null, createdAt: now, updatedAt: now },
        ]),
      },
    };
    const client = { $transaction: jest.fn((fn) => fn(tx)) };
    const repo = createPrismaTripStopRepository(client);

    const result = await repo.reorderStops('5', ['30', '10', '20']);

    expect(client.$transaction).toHaveBeenCalledTimes(1);

    // Phase 1: every stop first moved to a distinct negative stopOrder —
    // guaranteed disjoint from any real (positive) stopOrder, so none of
    // these writes can collide with the unique (tripId, stopOrder)
    // constraint no matter what order they run in.
    const phaseOne = updateCalls.slice(0, 3);
    expect(phaseOne.every((call) => call.stopOrder < 0)).toBe(true);
    expect(new Set(phaseOne.map((call) => call.stopOrder)).size).toBe(3);

    // Phase 2: final sequential order 1..3, following the requested id order.
    const phaseTwo = updateCalls.slice(3);
    expect(phaseTwo).toEqual([
      { id: 30, stopOrder: 1 },
      { id: 10, stopOrder: 2 },
      { id: 20, stopOrder: 3 },
    ]);

    expect(result).toHaveLength(3);
    expect(result.map((stop) => stop.id)).toEqual(['30', '10', '20']);
  });
});

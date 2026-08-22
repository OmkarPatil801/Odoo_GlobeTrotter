// Single composition point for every repository the app uses.
//
// This is the ONLY place that branches on how repositories are wired —
// controllers, services, routes, and middleware never check
// NODE_ENV/DATABASE_URL themselves, they just consume
// { userRepository, cityRepository, activityRepository, tripRepository,
// tripStopRepository } and depend only on the contracts in ./contracts/.
//
// env.useDatabase (see ../config/env.js) decides in-memory vs Prisma.
// The Prisma factories are required lazily, inside the branch that uses
// them, so @prisma/client is never touched when running in-memory (e.g.
// the whole test suite, or local dev without a DATABASE_URL).
const env = require('../config/env');

let userRepository;
let cityRepository;
let activityRepository;
let tripRepository;
let tripStopRepository;

if (env.useDatabase) {
  const createPrismaUserRepository = require('./prisma/userRepository.prisma');
  const createPrismaCityRepository = require('./prisma/cityRepository.prisma');
  const createPrismaActivityRepository = require('./prisma/activityRepository.prisma');
  const createPrismaTripRepository = require('./prisma/tripRepository.prisma');
  const createPrismaTripStopRepository = require('./prisma/tripStopRepository.prisma');

  userRepository = createPrismaUserRepository();
  cityRepository = createPrismaCityRepository();
  activityRepository = createPrismaActivityRepository();
  tripRepository = createPrismaTripRepository();
  tripStopRepository = createPrismaTripStopRepository();
} else {
  const createInMemoryUserRepository = require('./inMemoryUserRepository');
  const createInMemoryCityRepository = require('./inMemoryCityRepository');
  const createInMemoryActivityRepository = require('./inMemoryActivityRepository');
  const createInMemoryTripRepository = require('./inMemoryTripRepository');
  const createInMemoryTripStopRepository = require('./inMemoryTripStopRepository');

  userRepository = createInMemoryUserRepository();
  cityRepository = createInMemoryCityRepository();
  activityRepository = createInMemoryActivityRepository();
  tripRepository = createInMemoryTripRepository();
  tripStopRepository = createInMemoryTripStopRepository();
}

module.exports = { userRepository, cityRepository, activityRepository, tripRepository, tripStopRepository };

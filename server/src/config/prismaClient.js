const { PrismaClient } = require('@prisma/client');

// Single shared PrismaClient instance for the whole app — avoid creating
// a new client (and connection pool) per request/repository. Only ever
// required when src/repositories/index.js decides to use the Prisma
// repositories (env.useDatabase), so a missing/ungenerated @prisma/client
// never breaks the in-memory path the test suite runs on.
const prisma = new PrismaClient();

module.exports = prisma;

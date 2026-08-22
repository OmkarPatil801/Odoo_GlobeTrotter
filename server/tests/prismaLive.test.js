// Optional live-database smoke test. Only runs when DATABASE_URL is set
// AND a real MySQL server actually answers — this must never be a
// requirement for the normal test suite. It performs read-only queries
// only: no seeding, no writes, no schema changes.
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

const describeIfDatabaseUrl = hasDatabaseUrl ? describe : describe.skip;

describeIfDatabaseUrl('Prisma live database connectivity (DATABASE_URL set)', () => {
  let prisma;
  let connected = false;

  beforeAll(async () => {
    prisma = require('../src/config/prismaClient');
    try {
      await prisma.$queryRaw`SELECT 1`;
      connected = true;
    } catch (err) {
      // MySQL isn't actually reachable even though DATABASE_URL is set
      // (e.g. no server running in this environment) — skip the assertions
      // below individually rather than failing the whole suite.
      connected = false;
      // eslint-disable-next-line no-console
      console.warn('Skipping live Prisma checks — database unreachable:', err.message);
    }
  });

  afterAll(async () => {
    if (prisma) await prisma.$disconnect();
  });

  it('can read from the users table (read-only)', async () => {
    if (!connected) return;
    await expect(prisma.user.findMany({ take: 1 })).resolves.toBeDefined();
  });

  it('can read from the cities table (read-only)', async () => {
    if (!connected) return;
    await expect(prisma.city.findMany({ take: 1 })).resolves.toBeDefined();
  });

  it('can read from the activities table (read-only)', async () => {
    if (!connected) return;
    await expect(prisma.activity.findMany({ take: 1 })).resolves.toBeDefined();
  });
});

if (!hasDatabaseUrl) {
  describe('Prisma live database connectivity', () => {
    it('is skipped — no DATABASE_URL set in this environment', () => {
      expect(hasDatabaseUrl).toBe(false);
    });
  });
}

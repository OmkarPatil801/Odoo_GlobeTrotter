const { decimalToNumber } = require('../../utils/decimal');

function toApiCity(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    name: row.name,
    country: row.country,
    countryCode: row.countryCode,
    region: row.region,
    latitude: decimalToNumber(row.latitude),
    longitude: decimalToNumber(row.longitude),
    timezone: row.timezone,
    description: row.description,
    imageUrl: row.imageUrl,
  };
}

// MySQL's default collation (utf8mb4_*_ci) is case-insensitive, so a
// plain `contains`/`equals` filter already behaves case-insensitively —
// unlike Postgres, Prisma's `mode: 'insensitive'` option is not supported
// on the MySQL connector and must not be used here.
function buildWhere({ search, countryCode, country, region }) {
  const where = {};
  if (search) where.name = { contains: search };
  if (countryCode) where.countryCode = countryCode.toUpperCase();
  if (country) where.country = country;
  if (region) where.region = region;
  return where;
}

// Prisma-backed implementation of the CityRepository contract
// (see ../contracts/cityRepository.contract.js).
//
// `prisma` defaults to the shared client, resolved lazily — see
// userRepository.prisma.js for why.
function createPrismaCityRepository(prisma) {
  const client = prisma || require('../../config/prismaClient');

  async function findCityById(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const row = await client.city.findUnique({ where: { id: numericId } });
    return toApiCity(row);
  }

  async function listCities(filters = {}) {
    const { page, limit } = filters;
    const where = buildWhere(filters);
    const hasPagination = Boolean(page && limit);

    const [rows, total] = await Promise.all([
      client.city.findMany({
        where,
        skip: hasPagination ? (page - 1) * limit : undefined,
        take: hasPagination ? limit : undefined,
        orderBy: { name: 'asc' },
      }),
      client.city.count({ where }),
    ]);

    return { items: rows.map(toApiCity), total };
  }

  async function searchCities(query) {
    const rows = await client.city.findMany({
      where: { name: { contains: query } },
      orderBy: { name: 'asc' },
    });
    return rows.map(toApiCity);
  }

  return { findCityById, listCities, searchCities };
}

module.exports = createPrismaCityRepository;

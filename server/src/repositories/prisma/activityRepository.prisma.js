const { decimalToNumber } = require('../../utils/decimal');

function toApiActivity(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    cityId: String(row.cityId),
    name: row.name,
    category: row.category,
    description: row.description,
    // DB column is `durationHours` (Decimal) — the API's existing
    // `duration` field maps directly to it, normalized to a number.
    duration: decimalToNumber(row.durationHours),
    cost: decimalToNumber(row.cost),
    currencyCode: row.currencyCode,
    imageUrl: row.imageUrl,
  };
}

function buildCostFilter({ minCost, maxCost }) {
  if (minCost === undefined && maxCost === undefined) return undefined;
  const cost = {};
  if (minCost !== undefined) cost.gte = minCost;
  if (maxCost !== undefined) cost.lte = maxCost;
  return cost;
}

// Prisma-backed implementation of the ActivityRepository contract
// (see ../contracts/activityRepository.contract.js).
//
// `prisma` defaults to the shared client, resolved lazily — see
// userRepository.prisma.js for why.
function createPrismaActivityRepository(prisma) {
  const client = prisma || require('../../config/prismaClient');

  async function findActivityById(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const row = await client.activity.findUnique({ where: { id: numericId } });
    return toApiActivity(row);
  }

  async function listActivitiesByCity(cityId, filters = {}) {
    const numericCityId = Number(cityId);
    if (!Number.isInteger(numericCityId)) return { items: [], total: 0 };

    const { category, page, limit } = filters;
    const cost = buildCostFilter(filters);
    const hasPagination = Boolean(page && limit);

    const where = {
      cityId: numericCityId,
      ...(category ? { category } : {}),
      ...(cost ? { cost } : {}),
    };

    const [rows, total] = await Promise.all([
      client.activity.findMany({
        where,
        skip: hasPagination ? (page - 1) * limit : undefined,
        take: hasPagination ? limit : undefined,
        orderBy: { name: 'asc' },
      }),
      client.activity.count({ where }),
    ]);

    return { items: rows.map(toApiActivity), total };
  }

  async function searchActivities(query, filters = {}) {
    const { category, ...costFilters } = filters;
    const cost = buildCostFilter(costFilters);

    const where = {
      name: { contains: query },
      ...(category ? { category } : {}),
      ...(cost ? { cost } : {}),
    };

    const rows = await client.activity.findMany({ where, orderBy: { name: 'asc' } });
    return rows.map(toApiActivity);
  }

  return { findActivityById, listActivitiesByCity, searchActivities };
}

module.exports = createPrismaActivityRepository;

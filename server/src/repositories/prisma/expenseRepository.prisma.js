const { decimalToNumber } = require('../../utils/decimal');

// See tripStopRepository.prisma.js for the same UTC-midnight Date <->
// "YYYY-MM-DD" convention applied to `expenseDate`.
function toDateOnly(date) {
  if (!date) return null;
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toDbDate(dateOnlyString) {
  return new Date(`${dateOnlyString}T00:00:00.000Z`);
}

function toApiExpense(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    tripId: String(row.tripId),
    category: row.category,
    amount: decimalToNumber(row.amount),
    currencyCode: row.currencyCode,
    description: row.description,
    expenseDate: toDateOnly(row.expenseDate),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

// Prisma-backed implementation of the ExpenseRepository contract
// (see ../contracts/expenseRepository.contract.js).
//
// `prisma` defaults to the shared client, resolved lazily — see
// userRepository.prisma.js for why.
function createPrismaExpenseRepository(prisma) {
  const client = prisma || require('../../config/prismaClient');

  async function listExpensesByTrip(tripId, filters = {}) {
    const numericTripId = Number(tripId);
    if (!Number.isInteger(numericTripId)) return [];

    const where = { tripId: numericTripId };
    if (filters.category) where.category = filters.category;

    const rows = await client.expense.findMany({ where, orderBy: { expenseDate: 'asc' } });
    return rows.map(toApiExpense);
  }

  async function findExpenseById(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const row = await client.expense.findUnique({ where: { id: numericId } });
    return toApiExpense(row);
  }

  async function createExpense(tripId, data) {
    const row = await client.expense.create({
      data: {
        tripId: Number(tripId),
        category: data.category,
        amount: data.amount,
        currencyCode: data.currencyCode,
        description: data.description !== undefined ? data.description : null,
        expenseDate: toDbDate(data.expenseDate),
      },
    });
    return toApiExpense(row);
  }

  async function deleteExpense(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return;

    try {
      await client.expense.delete({ where: { id: numericId } });
    } catch (err) {
      if (err.code === 'P2025') return; // already gone — idempotent
      throw err;
    }
  }

  async function getBudgetSummary(tripId) {
    const numericTripId = Number(tripId);
    if (!Number.isInteger(numericTripId)) return { total: 0, byCategory: {} };

    const grouped = await client.expense.groupBy({
      by: ['category'],
      where: { tripId: numericTripId },
      _sum: { amount: true },
    });

    const byCategory = {};
    let total = 0;
    grouped.forEach((row) => {
      const sum = decimalToNumber(row._sum.amount) || 0;
      byCategory[row.category] = sum;
      total += sum;
    });

    return { total, byCategory };
  }

  return { listExpensesByTrip, findExpenseById, createExpense, deleteExpense, getBudgetSummary };
}

module.exports = createPrismaExpenseRepository;

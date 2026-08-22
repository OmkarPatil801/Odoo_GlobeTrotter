// In-memory implementation of the ExpenseRepository contract
// (see ./contracts/expenseRepository.contract.js). Used until the
// database teammate's real implementation is wired in for local dev
// without a DATABASE_URL, and directly by tests.
function createInMemoryExpenseRepository() {
  const expensesById = new Map();
  let nextId = 1;

  function toApiExpense(row) {
    return { ...row, id: String(row.id), tripId: String(row.tripId) };
  }

  async function listExpensesByTrip(tripId, filters = {}) {
    const numericTripId = Number(tripId);
    if (!Number.isInteger(numericTripId)) return [];

    let rows = Array.from(expensesById.values()).filter((expense) => expense.tripId === numericTripId);
    if (filters.category) {
      rows = rows.filter((expense) => expense.category === filters.category);
    }

    rows.sort((a, b) => a.expenseDate.localeCompare(b.expenseDate));
    return rows.map(toApiExpense);
  }

  async function findExpenseById(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const row = expensesById.get(numericId);
    return row ? toApiExpense(row) : null;
  }

  async function createExpense(tripId, data) {
    const numericId = nextId;
    nextId += 1;
    const now = new Date().toISOString();

    const row = {
      id: numericId,
      tripId: Number(tripId),
      category: data.category,
      amount: data.amount,
      currencyCode: data.currencyCode,
      description: data.description !== undefined ? data.description : null,
      expenseDate: data.expenseDate,
      createdAt: now,
      updatedAt: now,
    };
    expensesById.set(numericId, row);
    return toApiExpense(row);
  }

  async function deleteExpense(id) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return;
    expensesById.delete(numericId);
  }

  async function getBudgetSummary(tripId) {
    const numericTripId = Number(tripId);
    const rows = Array.from(expensesById.values()).filter((expense) => expense.tripId === numericTripId);

    const byCategory = {};
    let total = 0;
    rows.forEach((expense) => {
      byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount;
      total += expense.amount;
    });

    return { total, byCategory };
  }

  return { listExpensesByTrip, findExpenseById, createExpense, deleteExpense, getBudgetSummary };
}

module.exports = createInMemoryExpenseRepository;

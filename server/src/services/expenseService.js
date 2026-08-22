const AppError = require('../utils/appError');
const HTTP_STATUS = require('../utils/httpStatus');

function tripNotFoundError() {
  return new AppError('Trip not found', HTTP_STATUS.NOT_FOUND, 'TRIP_NOT_FOUND');
}

function expenseNotFoundError() {
  return new AppError('Expense not found', HTTP_STATUS.NOT_FOUND, 'EXPENSE_NOT_FOUND');
}

function daysInclusive(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T00:00:00.000Z`);
  const diffDays = Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return diffDays + 1;
}

// Factory so the service can be wired to any repository implementations
// satisfying the TripRepository/ExpenseRepository contracts. Expenses are
// always accessed through their parent trip, so this depends on
// tripRepository too — purely to verify ownership and compute the
// average-daily-cost figure from the trip's own date range.
function createExpenseService({ tripRepository, expenseRepository }) {
  async function assertTripOwnership(tripId, userId) {
    const trip = await tripRepository.findTripById(tripId);
    if (!trip || trip.userId !== userId) {
      throw tripNotFoundError();
    }
    return trip;
  }

  async function listExpenses(tripId, userId, filters) {
    await assertTripOwnership(tripId, userId);
    return expenseRepository.listExpensesByTrip(tripId, filters);
  }

  async function createExpense(tripId, userId, data) {
    await assertTripOwnership(tripId, userId);

    return expenseRepository.createExpense(tripId, {
      category: data.category,
      amount: data.amount,
      currencyCode: data.currencyCode,
      description: data.description !== undefined ? data.description : null,
      expenseDate: data.expenseDate,
    });
  }

  async function deleteExpense(tripId, expenseId, userId) {
    await assertTripOwnership(tripId, userId);

    const expense = await expenseRepository.findExpenseById(expenseId);
    if (!expense || expense.tripId !== tripId) {
      throw expenseNotFoundError();
    }

    await expenseRepository.deleteExpense(expenseId);
  }

  async function getBudget(tripId, userId) {
    const trip = await assertTripOwnership(tripId, userId);
    const summary = await expenseRepository.getBudgetSummary(tripId);
    const numberOfDays = daysInclusive(trip.startDate, trip.endDate);

    return {
      total: summary.total,
      byCategory: summary.byCategory,
      numberOfDays,
      averagePerDay: numberOfDays > 0 ? summary.total / numberOfDays : 0,
    };
  }

  return { listExpenses, createExpense, deleteExpense, getBudget };
}

module.exports = createExpenseService;

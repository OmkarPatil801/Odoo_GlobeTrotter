const { success, created, noContent } = require('../utils/apiResponse');

// Factory so tests (or any future composition) can inject a specific
// expenseService instance. Controllers only handle req/res — ownership
// and business rules live in the service.
function createExpenseController(expenseService) {
  async function list(req, res, next) {
    try {
      const filters = req.query.category ? { category: req.query.category } : {};
      const expenses = await expenseService.listExpenses(req.params.tripId, req.user.id, filters);
      return success(res, expenses);
    } catch (err) {
      return next(err);
    }
  }

  async function create(req, res, next) {
    try {
      const { category, amount, currencyCode, description, expenseDate } = req.body;
      const expense = await expenseService.createExpense(req.params.tripId, req.user.id, {
        category,
        amount,
        currencyCode,
        description,
        expenseDate,
      });
      return created(res, { expense });
    } catch (err) {
      return next(err);
    }
  }

  async function remove(req, res, next) {
    try {
      await expenseService.deleteExpense(req.params.tripId, req.params.expenseId, req.user.id);
      return noContent(res);
    } catch (err) {
      return next(err);
    }
  }

  async function getBudget(req, res, next) {
    try {
      const budget = await expenseService.getBudget(req.params.tripId, req.user.id);
      return success(res, budget);
    } catch (err) {
      return next(err);
    }
  }

  return { list, create, remove, getBudget };
}

module.exports = createExpenseController;

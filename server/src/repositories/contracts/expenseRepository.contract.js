/**
 * ExpenseRepository contract.
 *
 * Mirrors the pattern in tripStopRepository.contract.js — services,
 * controllers, and routes are written only against this shape, never a
 * specific ORM.
 *
 * Expense record shape:
 *   {
 *     id: string,
 *     tripId: string,
 *     category: 'TRANSPORT' | 'STAY' | 'ACTIVITY' | 'MEAL' | 'OTHER',
 *     amount: number,
 *     currencyCode: string,   // ISO-style 3-letter code, e.g. "USD"
 *     description: string | null,
 *     expenseDate: string,    // calendar date, "YYYY-MM-DD"
 *     createdAt: string,      // ISO 8601 timestamp (UTC)
 *     updatedAt: string,      // ISO 8601 timestamp (UTC)
 *   }
 *
 * Required methods:
 *
 *   listExpensesByTrip(tripId: string, filters?: { category?: string }): Promise<Expense[]>
 *     All expenses for the trip, optionally filtered to one category.
 *     Ordered by expenseDate ascending. Trip ownership has already been
 *     verified by the service layer.
 *
 *   findExpenseById(id: string): Promise<Expense | null>
 *     Resolve null (not throw) if `id` isn't a valid id or no expense
 *     matches. The service layer is responsible for also checking the
 *     resolved expense's `tripId` matches the trip in the URL.
 *
 *   createExpense(tripId: string, data: {
 *     category: string,
 *     amount: number,
 *     currencyCode: string,
 *     description?: string | null,
 *     expenseDate: string,
 *   }): Promise<Expense>
 *     Trip ownership has already been verified by the service layer.
 *
 *   deleteExpense(id: string): Promise<void>
 *     Idempotent — deleting an id that no longer exists is not an error.
 *
 *   getBudgetSummary(tripId: string): Promise<{
 *     total: number,
 *     byCategory: Record<string, number>,  // only categories with at
 *                                           // least one expense are present
 *   }>
 *     Aggregates all of the trip's expenses. `total` is the sum of every
 *     expense's `amount` regardless of currencyCode (the app currently
 *     treats a trip's expenses as tracked in one implicit currency — see
 *     server/database/README.md). Trip ownership has already been
 *     verified by the service layer, which also computes the average
 *     daily cost from `total` and the trip's date range (not this
 *     method's concern).
 *
 * Do not assume any particular ORM or driver — implement this contract
 * however database access ends up being wired.
 */
const EXPENSE_REPOSITORY_METHODS = [
  'listExpensesByTrip',
  'findExpenseById',
  'createExpense',
  'deleteExpense',
  'getBudgetSummary',
];

module.exports = { EXPENSE_REPOSITORY_METHODS };

const { body, param, query } = require('express-validator');

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const EXPENSE_CATEGORIES = ['TRANSPORT', 'STAY', 'ACTIVITY', 'MEAL', 'OTHER'];
const CURRENCY_CODE_PATTERN = /^[A-Z]{3}$/;

const tripIdParamValidation = [param('tripId').trim().notEmpty().withMessage('Trip id is required')];
const expenseIdParamValidation = [param('expenseId').trim().notEmpty().withMessage('Expense id is required')];

const listExpensesValidation = [
  query('category')
    .optional()
    .isIn(EXPENSE_CATEGORIES)
    .withMessage(`category must be one of ${EXPENSE_CATEGORIES.join(', ')}`),
];

const createExpenseValidation = [
  body('category')
    .isIn(EXPENSE_CATEGORIES)
    .withMessage(`category must be one of ${EXPENSE_CATEGORIES.join(', ')}`),
  body('amount').isFloat({ min: 0 }).withMessage('amount must be a non-negative number').toFloat(),
  body('currencyCode')
    .trim()
    .toUpperCase()
    .matches(CURRENCY_CODE_PATTERN)
    .withMessage('currencyCode must be a 3-letter ISO-style code, e.g. USD'),
  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string')
    .isLength({ max: 500 })
    .withMessage('description must be at most 500 characters'),
  body('expenseDate')
    .trim()
    .matches(DATE_ONLY_PATTERN)
    .withMessage('expenseDate must be a calendar date in YYYY-MM-DD format')
    .bail()
    .isISO8601({ strict: true })
    .withMessage('expenseDate must be a valid calendar date'),
];

module.exports = {
  tripIdParamValidation,
  expenseIdParamValidation,
  listExpensesValidation,
  createExpenseValidation,
};

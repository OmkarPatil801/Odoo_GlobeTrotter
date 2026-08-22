// Prisma represents `Decimal` database columns (City.latitude/longitude,
// Activity.durationHours/cost, Expense.amount, ...) using decimal.js
// `Decimal` objects, not plain JS numbers — never forward one directly
// into a JSON response (JSON.stringify would either throw or serialize
// internal fields depending on the version). Normalize at the repository
// boundary instead.
//
// Duck-typed on `.toNumber()` rather than importing the Decimal class, so
// this has no dependency on @prisma/client being installed/generated.
function decimalToNumber(value) {
  if (value === null || value === undefined) return value;
  if (typeof value === 'object' && typeof value.toNumber === 'function') {
    return value.toNumber();
  }
  return Number(value);
}

module.exports = { decimalToNumber };

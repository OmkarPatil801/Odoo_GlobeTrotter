const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

// Normalizes page/limit for a repository call. Validators already reject
// non-positive/non-integer values before this runs — this just fills in
// defaults when the query param was omitted, and caps the page size.
// Pagination math lives here (used by services), never in controllers.
//
// Values arrive as strings: Express 5 made req.query a read-only getter,
// so express-validator's .toInt() sanitizer can validate a query param but
// can't persist the converted value back onto req.query — parse here
// instead of trusting the type.
function normalizePagination({ page, limit } = {}) {
  const parsedPage = Number.parseInt(page, 10);
  const parsedLimit = Number.parseInt(limit, 10);

  const normalizedPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : DEFAULT_PAGE;
  const requestedLimit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : DEFAULT_LIMIT;
  const normalizedLimit = Math.min(requestedLimit, MAX_LIMIT);

  return { page: normalizedPage, limit: normalizedLimit };
}

function buildPaginationMeta({ page, limit, total }) {
  return {
    page,
    limit,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
  };
}

module.exports = { normalizePagination, buildPaginationMeta, DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT };

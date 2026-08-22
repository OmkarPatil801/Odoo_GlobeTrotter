const HTTP_STATUS = require('./httpStatus');

// { success: true, data: {...} }  — optionally with `meta` for lists (pagination, counts, etc.)
function success(res, data = {}, meta, statusCode = HTTP_STATUS.OK) {
  const body = { success: true, data };
  if (meta !== undefined) body.meta = meta;
  return res.status(statusCode).json(body);
}

function created(res, data = {}, meta) {
  return success(res, data, meta, HTTP_STATUS.CREATED);
}

function noContent(res) {
  return res.status(HTTP_STATUS.NO_CONTENT).send();
}

// { success: false, error: { code, message, details? } }
function error(res, {
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  code = 'INTERNAL_ERROR',
  message = 'Something went wrong',
  details,
} = {}) {
  const body = { success: false, error: { code, message } };
  if (details !== undefined) body.error.details = details;
  return res.status(statusCode).json(body);
}

module.exports = {
  success,
  created,
  noContent,
  error,
  HTTP_STATUS,
};

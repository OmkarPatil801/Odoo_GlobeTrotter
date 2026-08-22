const { error: sendError, HTTP_STATUS } = require('../utils/apiResponse');

// Mounted after all real /api routes — anything that falls through here
// didn't match a defined route.
function notFoundHandler(req, res) {
  return sendError(res, {
    statusCode: HTTP_STATUS.NOT_FOUND,
    code: 'NOT_FOUND',
    message: 'Route not found',
  });
}

module.exports = notFoundHandler;

const cors = require('./cors.middleware');
const logger = require('./logging.middleware');
const { notFound, errorHandler } = require('./error.middleware');
const helmet = require('./helmet.middleware');
const { apiLimiter, authLimiter, searchLimiter } = require('./rateLimit.middleware');
const { protect, restrictTo } = require('./auth.middleware');

module.exports = {
  cors,
  logger,
  notFound,
  errorHandler,
  helmet,
  apiLimiter,
  authLimiter, 
  searchLimiter,
  protect, 
  restrictTo
};
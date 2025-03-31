const config = require('../config/config');

/**
 * Middleware xử lý lỗi 404 - Not Found
 */
exports.notFound = (req, res, next) => {
  const error = new Error(`Không tìm thấy - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

/**
 * Middleware xử lý tất cả các lỗi
 */
exports.errorHandler = (err, req, res, next) => {
  console.error(err);
  
  // Mã trạng thái HTTP
  const statusCode = err.status || err.statusCode || 500;
  
  // Phân loại lỗi
  let errorResponse = {
    status: statusCode >= 500 ? 'error' : 'fail',
    message: err.message || 'Lỗi máy chủ nội bộ',
  };

  // Chỉ thêm stack trace trong môi trường development
  if (config.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Xử lý các loại lỗi cụ thể
  
  // MongoDB validation errors
  if (err.name === 'ValidationError') {
    errorResponse.status = 'fail';
    errorResponse.message = 'Lỗi dữ liệu không hợp lệ';
    errorResponse.errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));
    return res.status(400).json(errorResponse);
  }
  
  // MongoDB duplicate key error
  if (err.code === 11000) {
    errorResponse.status = 'fail';
    errorResponse.message = 'Dữ liệu đã tồn tại';
    errorResponse.field = Object.keys(err.keyValue)[0];
    return res.status(400).json(errorResponse);
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    errorResponse.status = 'fail';
    errorResponse.message = 'Token không hợp lệ';
    return res.status(401).json(errorResponse);
  }
  
  if (err.name === 'TokenExpiredError') {
    errorResponse.status = 'fail';
    errorResponse.message = 'Token đã hết hạn';
    return res.status(401).json(errorResponse);
  }

  // Lỗi Cast của MongoDB (ví dụ: objectId không hợp lệ)
  if (err.name === 'CastError') {
    errorResponse.status = 'fail';
    errorResponse.message = `Không hợp lệ ${err.path}: ${err.value}`;
    return res.status(400).json(errorResponse);
  }

  // Gửi response với mã lỗi thích hợp
  return res.status(statusCode).json(errorResponse);
};
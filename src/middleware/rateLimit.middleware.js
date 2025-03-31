const rateLimit = require('express-rate-limit');
const config = require('../config/config');

// Cấu hình rate limiter tùy theo môi trường
const limiterOptions = {
  windowMs: 15 * 60 * 1000, // 15 phút
  max: config.NODE_ENV === 'production' ? 100 : 1000, // 100 request/IP trong production, 1000 trong development
  standardHeaders: true, // Trả về RateLimit-* headers
  legacyHeaders: false, // Tắt X-RateLimit-* headers
  message: {
    status: 'error',
    message: 'Quá nhiều yêu cầu từ địa chỉ IP này, vui lòng thử lại sau 15 phút.'
  },
  // Cấu hình chỉ áp dụng cho production
  skip: (req, res) => config.NODE_ENV !== 'production',
  // Kiểm tra IP thông qua header X-Forwarded-For (nếu đằng sau proxy)
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for'] || req.ip;
  }
};

// Rate limiter chung cho tất cả các API endpoints
exports.apiLimiter = rateLimit({
  ...limiterOptions
});

// Rate limiter nghiêm ngặt hơn cho endpoints authentication
exports.authLimiter = rateLimit({
  ...limiterOptions,
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: config.NODE_ENV === 'production' ? 10 : 100, // 10 lần trong production, 100 trong development
  message: {
    status: 'error',
    message: 'Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau 1 giờ.'
  }
});

// Rate limiter đặc biệt cho search API
exports.searchLimiter = rateLimit({
  ...limiterOptions,
  windowMs: 5 * 60 * 1000, // 5 phút
  max: config.NODE_ENV === 'production' ? 50 : 500, // 50 lần search trong production, 500 trong development
});
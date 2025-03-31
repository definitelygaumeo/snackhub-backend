const helmet = require('helmet');
const config = require('../config/config');

// Cấu hình Helmet tùy theo môi trường
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'", process.env.FRONTEND_URL || '*'],
    },
    // Tắt CSP trong môi trường development để dễ debug
    ...(config.NODE_ENV === 'development' && { reportOnly: true })
  },
  crossOriginEmbedderPolicy: false, // Cho phép tải tài nguyên từ nguồn khác
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Cho phép chia sẻ tài nguyên
  dnsPrefetchControl: { allow: false }, // Ngăn prefetch DNS
  frameguard: { action: 'deny' }, // Ngăn iframe từ sites khác
  hidePoweredBy: true, // Ẩn header X-Powered-By
  hsts: {
    maxAge: 15552000, // 180 ngày
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true, // Ngăn IE mở downloads
  noSniff: true, // Ngăn MIME sniffing
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  referrerPolicy: { policy: 'same-origin' },
  xssFilter: true // Bảo vệ XSS cơ bản
};

// Export middleware helmet đã cấu hình
module.exports = helmet(helmetConfig);
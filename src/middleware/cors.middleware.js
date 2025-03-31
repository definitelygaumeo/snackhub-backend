const cors = require('cors');
const config = require('../config/config');

// Cấu hình CORS cho các môi trường khác nhau
const corsOptions = {
  origin: config.NODE_ENV === 'production' 
    ? ['https://snackhub.com', 'https://admin.snackhub.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true, // Cho phép gửi cookies
  maxAge: 86400, // Thời gian cache preflight request (24 giờ)
  optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);
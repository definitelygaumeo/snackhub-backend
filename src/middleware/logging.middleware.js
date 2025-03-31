const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

// Đảm bảo thư mục logs tồn tại
const logDirectory = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Tạo stream để ghi log
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, 'access.log'),
  { flags: 'a' }
);

// Format log chi tiết cho môi trường production
const productionFormat = ':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

// Format log đơn giản hơn cho môi trường development
const developmentLogger = morgan('dev');

// Format chi tiết cho môi trường production
const productionLogger = morgan(productionFormat, {
  stream: accessLogStream,
  skip: (req, res) => {
    // Bỏ qua logging các file tĩnh
    return req.url.startsWith('/public') || req.url.startsWith('/uploads');
  }
});

// Middleware kết hợp - log vào console trong dev, log vào file trong production
const logger = (req, res, next) => {
  if (config.NODE_ENV === 'production') {
    return productionLogger(req, res, next);
  } else {
    return developmentLogger(req, res, next);
  }
};

module.exports = logger;
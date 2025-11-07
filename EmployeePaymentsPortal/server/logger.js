const { createLogger, format, transports } = require('winston');
const path = require('path');
const logsDir = path.join(__dirname, 'logs');
const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: path.join(logsDir, 'combined.log') }),
    new transports.Console()
  ]
});
module.exports = logger;

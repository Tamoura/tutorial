/**
 * Structured JSON logger — replaces ACE Activity Log.
 * Outputs to stdout for container log collection (EFK / Loki).
 */
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: process.env.SERVICE_NAME || 'ace-replacement-service' },
  transports: [new winston.transports.Console()],
});

module.exports = { logger };

const winston = require('winston');
require('winston-daily-rotate-file'); // 引入輪替插件
const path = require('path');

const logDir = path.join(__dirname, './logs');
const { format } = winston;
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

// 定義通用的銷毀與壓縮規則
const commonRotateConfig = {
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '90d',
};

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        myFormat
    ),
    transports: [
        new winston.transports.Console(),

        new winston.transports.DailyRotateFile({
            filename: path.join(logDir, 'error-%DATE%.log'),
            auditFile: path.join(logDir, '.error-audit.json'),
            level: 'error',
            ...commonRotateConfig,
        }),

        new winston.transports.DailyRotateFile({
            filename: path.join(logDir, 'combined-%DATE%.log'),
            auditFile: path.join(logDir, '.combined-audit.json'),
            ...commonRotateConfig,
        }),
    ],
});

module.exports = logger;

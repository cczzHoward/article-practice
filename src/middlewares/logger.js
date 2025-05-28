const logger = require('../utils/logger');

const logRequest = (req, res, next) => {
    logger.info(`[${req.method}] ${req.originalUrl}`);
    next();
};

module.exports = {
    logRequest,
};
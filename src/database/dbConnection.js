const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectionString = process.env.MONGODB_URI;
const connection = mongoose.createConnection();

const connectWithRetry = () => {
    console.log('Attempting MongoDB connection...');
    connection.openUri(connectionString).catch((err) => {
        logger.error('MongoDB connection unsuccessful, retry after 5 seconds.', err);
        setTimeout(connectWithRetry, 5000);
    });
};

if (process.env.NODE_ENV !== 'test') {
    connection.on('connected', () => {
        console.log('MongoDB connected successfully');
    });

    connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });

    connectWithRetry();
}

connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
});

module.exports = connection;

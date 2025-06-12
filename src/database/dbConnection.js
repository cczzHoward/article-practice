const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectionString = process.env.MONGODB_URI;
const connection = mongoose.createConnection(connectionString);

if (process.env.NODE_ENV !== 'test') {
    connection.on('connected', () => {
        console.log('MongoDB connected successfully');
    });

    connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });
}

connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
});

module.exports = connection;

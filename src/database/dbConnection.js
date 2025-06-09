const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectionString = process.env.MONGODB_URI;
const connection = mongoose.createConnection(connectionString);

connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});

connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
});

connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

module.exports = connection;

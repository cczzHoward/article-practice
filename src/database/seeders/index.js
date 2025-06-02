const mongoose = require('mongoose');
require('dotenv').config();
const seedUsers = require('./user');
const seedArticles = require('./article');

async function runSeeder() {
    console.log('Starting database seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    await seedUsers();
    await seedArticles();
    await mongoose.disconnect();
    console.log('All seeding done!');
    process.exit();
}

runSeeder();
const mongoose = require('mongoose');
const { Schema } = mongoose;
const connection = require('../database/dbConnection');
const BaseSchema = require('../base/baseSchema')

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
});

categorySchema.plugin(BaseSchema);

const CategoryModel = connection.model('Category', categorySchema);

module.exports = CategoryModel;
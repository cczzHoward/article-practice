const mongoose = require('mongoose');
const { Schema } = mongoose;
const connection = require('../database/dbConnection');

const articleSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
});

const ArticleModel = connection.model('Article', articleSchema);

module.exports = ArticleModel;
const mongoose = require('mongoose');
const { Schema } = mongoose;
const connection = require('../database/dbConnection');
const BaseSchema = require('../base/baseSchema');

const articleSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            default: [],
        },
    ],
});

articleSchema.plugin(BaseSchema); // Apply the base schema plugin

const ArticleModel = connection.model('Article', articleSchema);

module.exports = ArticleModel;

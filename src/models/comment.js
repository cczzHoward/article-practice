const mongoose = require('mongoose');
const { Schema } = mongoose;
const connection = require('../database/dbConnection');
const BaseSchema = require('../base/baseSchema');

const commentSchema = new Schema({
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 1000,
    },
});

commentSchema.plugin(BaseSchema);

const CommentModel = connection.model('Comment', commentSchema);

module.exports = CommentModel;

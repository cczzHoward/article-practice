const Joi = require('joi');

const postCommentSchema = Joi.object({
    content: Joi.string().min(1).max(10000).required(),
}).required();

module.exports = {
    postCommentSchema,
};

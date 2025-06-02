const Joi = require('joi');

const createArticleSchema = Joi.object({
    title: Joi.string().min(1).max(128).required(),
    content: Joi.string().min(1).max(25565).required(),
})
.required();

const updateArticleSchema = Joi.object({
    title: Joi.string().min(1).max(128),
    content: Joi.string().min(1).max(25565),
})
.required(); // 強制 body 不能為空

module.exports = {
    createArticleSchema,
    updateArticleSchema,
};
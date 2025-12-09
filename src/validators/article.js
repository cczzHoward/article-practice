const Joi = require('joi');

const getAllArticlesSchema = Joi.object({
    keyword: Joi.string().min(1).max(128).optional(),
    category: Joi.string()
        .valid(
            '技術新知',
            '前端',
            '後端',
            '資料庫',
            '測試',
            '安全',
            'API 設計',
            '部署與維運',
            '使用者體驗',
            '其他'
        )
        .optional(),
    author: Joi.string().hex().length(24).optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
}).unknown(false);

const createArticleSchema = Joi.object({
    title: Joi.string().min(1).max(128).required(),
    content: Joi.string().min(1).max(25565).required(),
    category: Joi.string()
        .valid(
            '技術新知',
            '前端',
            '後端',
            '資料庫',
            '測試',
            '安全',
            'API 設計',
            '部署與維運',
            '使用者體驗',
            '其他'
        )
        .required(),
}).required();

const updateArticleSchema = Joi.object({
    title: Joi.string().min(1).max(128),
    content: Joi.string().min(1).max(25565),
}).or('title', 'content');

module.exports = {
    getAllArticlesSchema,
    createArticleSchema,
    updateArticleSchema,
};

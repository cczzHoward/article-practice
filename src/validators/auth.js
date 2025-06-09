const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().min(1).max(64).required(),
    password: Joi.string().min(8).max(64).required(),
}).required();

const loginSchema = Joi.object({
    username: Joi.string().min(1).max(64).required(),
    password: Joi.string().min(8).max(64).required(),
}).required();

const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().min(8).max(64).required(),
    newPassword: Joi.string().min(8).max(64).required(),
}).required();

module.exports = {
    registerSchema,
    loginSchema,
    changePasswordSchema,
};

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const objectIdSchema = Joi.object({
    id: Joi.objectId().required(),
}).required();

module.exports = {
    objectIdSchema,
};

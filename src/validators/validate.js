const responseUtils = require('../utils/response');

module.exports =
    (schema, property = 'body') =>
    (req, res, next) => {
        const { error } = schema.validate(req[property], { abortEarly: false });
        if (error) {
            return responseUtils.badRequest(
                res,
                'Validation failed',
                error.details.map((e) => e.message)
            );
        }
        next();
    };

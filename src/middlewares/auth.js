const responseUtils = require('../utils/response');

function isAdmin(req, res, next) {
    if (req.user.role === 'admin') return next();
    return responseUtils.forbidden(res, 'You do not have permission to access this resource');
}

function isSelfOrAdmin(req, res, next) {
    if (req.user.role === 'admin' || req.user._id.toString() === req.params.id) return next();
    return responseUtils.forbidden(res, 'You do not have permission to access this resource');
}

module.exports = {
    isSelfOrAdmin,
    isAdmin,
};
const responseUtils = require('../utils/response');
const ArticleService = require('../services/article');

function isAdmin(req, res, next) {
    if (req.user.role === 'admin') return next();
    return responseUtils.forbidden(res, 'You do not have permission to access this resource');
}

// 僅限作者本人或 admin
async function isArticleSelfOrAdmin(req, res, next) {
    const article = await ArticleService.findById(req.params.id);

    if (!article) {
        return responseUtils.notFound(res, 'Article not found');
    }

    if (req.user.role === 'admin' || article.author.username.toString() === req.user.username) {
        return next();
    }

    return responseUtils.forbidden(res, 'You do not have permission to access this resource');
}

function isUserSelfOrAdminButNotSelf(req, res, next) {
    const isAdmin = req.user.role === 'admin';
    const isSelf = req.user.id.toString() === req.params.id.toString();

    if (isAdmin && !isSelf) return next(); // admin 只能刪除別人
    if (!isAdmin && isSelf) return next(); // user 只能刪除自己

    // 其他情況都禁止
    return responseUtils.forbidden(res, 'You do not have permission to delete this user');
}

module.exports = {
    isArticleSelfOrAdmin,
    isAdmin,
    isUserSelfOrAdminButNotSelf,
};

const responseUtils = require('../utils/response');
const ArticleService = require('../services/article');

function isAdmin(req, res, next) {
    if (req.user.role === 'admin') return next();
    return responseUtils.forbidden(res, 'You do not have permission to access this resource');
}

// 僅限作者本人或 admin
async function isArticleSelfOrAdmin(req, res, next) {
    const article = await ArticleService.findById(req.params.id);
    console.log(article);

    if (!article) {
        return responseUtils.notFound(res, 'Article not found');
    }
    console.log(article.author.username.toString(), req.user.username);

    if (req.user.role === 'admin' || article.author.username.toString() === req.user.username) {
        return next();
    }

    return responseUtils.forbidden(res, 'You do not have permission to access this resource');
}

module.exports = {
    isArticleSelfOrAdmin,
    isAdmin,
};
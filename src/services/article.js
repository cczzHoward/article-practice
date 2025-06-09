const ArticleRepository = require('../repositories/article');
const CategoryRepository = require('../repositories/category');
const UserRepository = require('../repositories/user');
const BaseService = require('../base/baseService');

class ArticleService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    // ArticleService 自己特有的方法可以從這裡往下寫
    async searchAndPaginate({ keyword, category, page, limit }) {
        return this.repository.searchAndPaginate({ keyword, category, page, limit });
    }

    async getCategoryIdByName(categoryName) {
        return CategoryRepository.findOneByName(categoryName);
    }

    async addPostedArticleToAuthor(authorId, articleId) {
        return UserRepository.addPostedArticleToAuthor(authorId, articleId);
    }

    async removePostedArticleFromAuthor(authorId, articleId) {
        return UserRepository.removePostedArticleFromAuthor(authorId, articleId);
    }

    async getAuthorIdByArticle(articleId) {
        return this.repository.getAuthorIdByArticle(articleId);
    }
}

module.exports = new ArticleService(ArticleRepository);

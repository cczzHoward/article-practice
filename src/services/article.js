const ArticleRepository = require('../repositories/article');
const CategoryRepository = require('../repositories/category');
const UserRepository = require('../repositories/user');
const BaseService = require('../base/baseService');
const conn = require('../database/dbConnection');

class ArticleService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    // ArticleService 自己特有的方法可以從這裡往下寫
    async searchAndPaginate({ keyword, category, author, page, limit }) {
        return this.repository.searchAndPaginate({ keyword, category, author, page, limit });
    }

    async getCategoryIdByName(categoryName) {
        return CategoryRepository.findOneByName(categoryName);
    }

    async getAuthorIdByArticle(articleId) {
        return this.repository.getAuthorIdByArticle(articleId);
    }

    async deleteWithTx(articleId, authorId) {
        let session;
        try {
            session = await conn.startSession();
            session.startTransaction();
            // 刪除文章
            await this.repository.delete(articleId, { session });

            // 從作者的 postedArticles 中移除文章 ID
            await UserRepository.removePostedArticleFromAuthor(authorId, articleId, { session });

            await session.commitTransaction();
            return true;
        } catch (err) {
            await session.abortTransaction();
            throw new Error(`Transaction failed: ${err.message}`);
        } finally {
            session.endSession();
        }
    }

    async createWithTx(articleData, authorId) {
        let session;
        try {
            session = await conn.startSession();
            session.startTransaction();

            // 創建文章
            const article = await this.repository.create(articleData, { session });

            // 將新創建的文章 ID 添加到作者的 postedArticles 中
            await UserRepository.addPostedArticleToAuthor(authorId, article._id, { session });

            await session.commitTransaction();
            return article;
        } catch (err) {
            await session.abortTransaction();
            throw new Error(`Transaction failed: ${err.message}`);
        } finally {
            session.endSession();
        }
    }

    async addLike(articleId, userId) {
        return this.repository.addLike(articleId, userId);
    }

    async removeLike(articleId, userId) {
        return this.repository.removeLike(articleId, userId);
    }
}

module.exports = new ArticleService(ArticleRepository);

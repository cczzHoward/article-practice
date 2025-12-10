const ArticleService = require('../services/article');
const BaseController = require('../base/baseController');
const logger = require('../utils/logger');
const responseUtils = require('../utils/response');

class ArticleController extends BaseController {
    constructor(service, resourceName) {
        super(service, resourceName);
        this.like = this.like.bind(this);
        this.unlike = this.unlike.bind(this);
        this.getLiked = this.getLiked.bind(this);
    }

    // 這裡可以覆寫 BaseController 的方法，或添加 ArticleController 特有的方法
    async getAll(req, res) {
        try {
            const { keyword, category, page, limit, author } = req.query;
            let categoryId = null;

            // 取得 categoryId
            if (category) {
                const foundCategory = await this.service.getCategoryIdByName(category);
                if (foundCategory) {
                    categoryId = foundCategory._id;
                }
            }

            const result = await ArticleService.searchAndPaginate({
                keyword,
                category: categoryId,
                author,
                page: parseInt(page, 10) || 1,
                limit: parseInt(limit, 10) || 10,
            });
            responseUtils.success(res, result, 'Get articles success');
        } catch (error) {
            logger.error('Error in getAll:', error);
            responseUtils.error(res, 'Internal server error');
        }
    }

    async create(req, res) {
        try {
            const { title, content, category } = req.body;

            const categoryId = await this.service.getCategoryIdByName(category);
            if (!categoryId) {
                return responseUtils.badRequest(res, 'Category not found');
            }

            const articleData = {
                title,
                content,
                category: categoryId._id,
                author: req.user.id,
            };

            const data = await this.service.createWithTx(articleData, req.user.id);

            responseUtils.created(res, data, `${this.resourceName} created successfully`);
        } catch (error) {
            logger.error(`Error creating ${this.resourceName}:`, error);
            responseUtils.error(res, `Error creating ${this.resourceName}`);
        }
    }

    async update(req, res) {
        try {
            // 檢查文章是否存在
            const article = await this.service.findById(req.params.id);
            if (!article) {
                return responseUtils.notFound(res, `${this.resourceName} not found`);
            }

            const data = await this.service.update(req.params.id, req.body);
            responseUtils.success(res, data, `${this.resourceName} updated successfully`);
        } catch (error) {
            logger.error(`Error updating ${this.resourceName}:`, error);
            responseUtils.error(res, `Error updating ${this.resourceName}`);
        }
    }

    async delete(req, res) {
        try {
            // 檢查文章是否存在
            const article = await this.service.findById(req.params.id);
            if (!article) {
                return responseUtils.notFound(res, `${this.resourceName} not found`);
            }

            const authorId = article.author._id;

            await this.service.deleteWithTx(req.params.id, authorId);

            responseUtils.noContent(res, `${this.resourceName} deleted successfully`);
        } catch (error) {
            logger.error(`Error deleting ${this.resourceName}:`, error);
            responseUtils.error(res, `Error deleting ${this.resourceName}`);
        }
    }

    async like(req, res) {
        try {
            const article = await this.service.findById(req.params.id);
            if (!article) {
                return responseUtils.notFound(res, `${this.resourceName} not found`);
            }

            const updatedArticle = await this.service.addLike(req.params.id, req.user.id);
            responseUtils.success(res, updatedArticle, 'Article liked successfully');
        } catch (error) {
            logger.error(`Error liking ${this.resourceName}:`, error);
            responseUtils.error(res, `Error liking ${this.resourceName}`);
        }
    }

    async unlike(req, res) {
        try {
            const article = await this.service.findById(req.params.id);
            if (!article) {
                return responseUtils.notFound(res, `${this.resourceName} not found`);
            }

            const updatedArticle = await this.service.removeLike(req.params.id, req.user.id);
            responseUtils.success(res, updatedArticle, 'Article unliked successfully');
        } catch (error) {
            logger.error(`Error unliking ${this.resourceName}:`, error);
            responseUtils.error(res, `Error unliking ${this.resourceName}`);
        }
    }

    async getLiked(req, res) {
        try {
            const { page, limit } = req.query;
            const result = await ArticleService.searchAndPaginate({
                likedBy: req.user.id,
                page: parseInt(page, 10) || 1,
                limit: parseInt(limit, 10) || 10,
            });
            responseUtils.success(res, result, 'Get liked articles success');
        } catch (error) {
            logger.error('Error in getLiked:', error);
            responseUtils.error(res, 'Internal server error');
        }
    }
}

module.exports = new ArticleController(ArticleService, 'article');

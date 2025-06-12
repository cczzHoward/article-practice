const ArticleService = require('../services/article');
const BaseController = require('../base/baseController');
const logger = require('../utils/logger');
const responseUtils = require('../utils/response');
const isValidObjectId = require('../utils/isValidObjectId');

class ArticleController extends BaseController {
    constructor(service, resourceName) {
        super(service, resourceName);
    }

    // 這裡可以覆寫 BaseController 的方法，或添加 ArticleController 特有的方法
    async getAll(req, res) {
        try {
            const { keyword, category, page, limit } = req.query;
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
            // TODO: 不知道這個檢查 ObjectId 的方法是不是好的，感覺有點冗長
            if (!isValidObjectId(req.params.id)) {
                return responseUtils.badRequest(res, 'Invalid article ID');
            }
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
}

module.exports = new ArticleController(ArticleService, 'article');

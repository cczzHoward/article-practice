const ArticleService = require('../services/article');
const BaseController = require('../base/baseController');
const logger = require('../utils/logger');
const responseUtils = require('../utils/response');

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
                limit: parseInt(limit, 10) || 10
            });
            responseUtils.success(res, result, 'Get articles success');
        } catch (error) {
            logger.error('Error in getAll:', error);
            responseUtils.error(res, 'Internal server error');
        }
    }

    async create(req, res) {
        try {
            const data = await this.service.create(req.body);
            responseUtils.created(res, data, `${this.resourceName} created successfully`);
        } catch (error) {
            logger.error(`Error creating ${this.resourceName}:`, error);
            responseUtils.error(res, `Error creating ${this.resourceName}`);
        }
    };
}

module.exports = new ArticleController(ArticleService, 'article');
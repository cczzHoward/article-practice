const logger = require('../utils/logger');
const ArticleService = require('../services/article');
const BaseController = require('../base/baseController');

class ArticleController extends BaseController {
    constructor() {
        super(ArticleService, 'article');
    }

    // 這裡可以覆寫 BaseController 的方法，或添加 ArticleController 特有的方法
}

module.exports = new ArticleController();
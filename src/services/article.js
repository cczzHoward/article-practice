const logger = require('../utils/logger');
const ArticleRepository = require('../repositories/article');
const BaseService = require('../base/baseService');

class ArticleService extends BaseService {
    constructor() {
        super(ArticleRepository);
    }

    // ArticleService 自己特有的方法可以從這裡往下寫
}

module.exports = new ArticleService();
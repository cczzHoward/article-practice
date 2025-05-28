const ArticleRepository = require('../repositories/article');
const BaseService = require('../base/baseService');

class ArticleService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    // ArticleService 自己特有的方法可以從這裡往下寫
}

module.exports = new ArticleService(ArticleRepository);
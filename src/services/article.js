const ArticleRepository = require('../repositories/article');
const BaseService = require('../base/baseService');

class ArticleService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    // ArticleService 自己特有的方法可以從這裡往下寫
    async searchAndPaginate({ keyword, page , limit }) {
        return this.repository.searchAndPaginate({ keyword, page, limit });
    }
}

module.exports = new ArticleService(ArticleRepository);
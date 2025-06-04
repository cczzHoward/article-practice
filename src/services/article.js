const ArticleRepository = require('../repositories/article');
const CategoryRepository = require('../repositories/category');
const BaseService = require('../base/baseService');

class ArticleService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    // ArticleService 自己特有的方法可以從這裡往下寫
    async searchAndPaginate({ keyword, category,page , limit }) {
        return this.repository.searchAndPaginate({ keyword, category, page, limit });
    }

    async getCategoryIdByName(categoryName) {
        return CategoryRepository.findOneByName(categoryName);
    }
}

module.exports = new ArticleService(ArticleRepository);
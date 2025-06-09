const CategoryRepository = require('../repositories/category');
const BaseService = require('../base/baseService');

class CategoryService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    // CategoryService 自己特有的方法可以從這裡往下寫
}

module.exports = new CategoryService(CategoryRepository);

const CategoryService = require('../services/category');
const BaseController = require('../base/baseController');

class CategoryController extends BaseController {
    constructor(service, resourceName) {
        super(service, resourceName);
    }
    
    // 這裡可以覆寫 BaseController 的方法，或添加 CategoryController 特有的方法
}

module.exports = new CategoryController(CategoryService, 'category');
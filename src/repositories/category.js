const CategoryModel = require('../models/category');
const BaseRepository = require('../base/baseRepository');

class CategoryRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    // CategoryRepository 自己特有的方法可以從這裡往下寫
    async findOneByName(name) {
        return this.model.findOne({ name }).select('_id name');
    }
}

module.exports = new CategoryRepository(CategoryModel);
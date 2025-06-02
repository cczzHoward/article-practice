const ArticleModel = require('../models/article');
const BaseRepository = require('../base/baseRepository');

class ArticleRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    // ArticleRepository 自己特有的方法可以從這裡往下寫
    async findAll(filter = {}) {
        return this.model.find(filter).populate('author', 'username -_id');
    }

    async findById(id) {
        return this.model.findById(id).populate('author', 'username -_id');
    }
}

module.exports = new ArticleRepository(ArticleModel);
const ArticleModel = require('../models/article');
const BaseRepository = require('../base/baseRepository');

class ArticleRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    // ArticleRepository 自己特有的方法可以從這裡往下寫
}

module.exports = new ArticleRepository(ArticleModel);
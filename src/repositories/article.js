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

    async searchAndPaginate({ keyword, page, limit }) {
        const filter = {};
        if (keyword) {
            filter.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { content: { $regex: keyword, $options: 'i' } }
            ];
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.model.find(filter)
                .populate('author', 'username -_id')
                .skip(skip)
                .limit(limit)
                .sort({ created_at: -1 }),
            this.model.countDocuments(filter)
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
}

module.exports = new ArticleRepository(ArticleModel);
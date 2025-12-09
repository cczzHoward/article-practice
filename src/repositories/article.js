const ArticleModel = require('../models/article');
const BaseRepository = require('../base/baseRepository');

class ArticleRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    // ArticleRepository 自己特有的方法可以從這裡往下寫
    async findAll(filter = {}) {
        return this.model
            .find(filter)
            .populate('author', 'username -_id')
            .populate('category', 'name -_id');
    }

    async findById(id) {
        return this.model
            .findById(id)
            .populate('author', 'username _id')
            .populate('category', 'name -_id')
            .populate({
                path: 'comments',
                select: 'content created_at user',
                populate: { path: 'user', select: 'username' },
            });
    }

    async searchAndPaginate({ keyword, category, author, page, limit }) {
        const filter = {};
        if (keyword) {
            filter.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { content: { $regex: keyword, $options: 'i' } },
            ];
        }
        if (category) {
            filter.category = category;
        }
        if (author) {
            filter.author = author;
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.model
                .find(filter)
                .select('-comments')
                .populate('author', 'username')
                .populate('category', 'name -_id')
                .skip(skip)
                .limit(limit)
                .sort({ created_at: -1 }),
            this.model.countDocuments(filter),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getCategoryIdByName(categoryName) {
        return this.model.find({ category: categoryName }).select('category');
    }

    async getAuthorIdByArticle(articleId) {
        return this.model.findById(articleId).select('author -_id');
    }

    async addCommentToArticle(articleId, commentId, options = {}) {
        return this.model.findByIdAndUpdate(
            articleId,
            { $push: { comments: commentId } },
            { new: true, ...options }
        );
    }

    async removeCommentFromArticle(articleId, commentId, options = {}) {
        return this.model.findByIdAndUpdate(
            articleId,
            { $pull: { comments: commentId } },
            { new: true, ...options }
        );
    }
}

module.exports = new ArticleRepository(ArticleModel);

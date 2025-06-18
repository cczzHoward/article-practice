const CommentModel = require('../models/comment');
const BaseRepository = require('../base/baseRepository');

class CommentRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    async findAll(filter = {}) {
        return this.model
            .find(filter)
            .populate('article', 'title -_id')
            .populate('user', 'username -_id');
    }

    async findById(id) {
        return this.model
            .findById(id)
            .populate('article', 'title -_id')
            .populate('user', 'username -_id');
    }

    // CommentRepository 自己特有的方法可以從這裡往下寫
}

module.exports = new CommentRepository(CommentModel);

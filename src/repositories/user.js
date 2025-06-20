const UserModel = require('../models/user');
const BaseRepository = require('../base/baseRepository');

class UserRepository extends BaseRepository {
    constructor(model) {
        super(model);
    }

    // UserRepository 自己特有的方法可以從這裡往下寫
    async findByUsername(username) {
        return this.model.findOne({ username });
    }

    async addPostedArticleToAuthor(authorId, articleId, options = {}) {
        return this.model.findByIdAndUpdate(
            authorId,
            { $addToSet: { postedArticles: articleId } },
            { ...options, new: true }
        );
    }

    async removePostedArticleFromAuthor(authorId, articleId, options = {}) {
        return this.model.findByIdAndUpdate(
            authorId,
            { $pull: { postedArticles: articleId } },
            { ...options, new: true }
        );
    }
}

module.exports = new UserRepository(UserModel);

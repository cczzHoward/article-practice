const UserModel = require('../models/user');
const BaseRepository = require('../base/baseRepository');

class UserRepository extends BaseRepository {
    constructor() {
        super(UserModel);
    }

    // UserRepository 自己特有的方法可以從這裡往下寫
    findByUsername(username) {
        return this.model.findOne({ username });
    }
}

module.exports = new UserRepository();
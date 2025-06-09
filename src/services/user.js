const BaseService = require('../base/baseService');
const UserRepository = require('../repositories/user');

class UserService extends BaseService {
    constructor() {
        super(UserRepository);
    }
}

module.exports = new UserService(UserRepository);

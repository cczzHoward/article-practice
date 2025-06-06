const BaseController = require('../base/baseController');
const UserService = require('../services/user');
const responseUtils = require('../utils/response');
const logger = require('../utils/logger');

class UserController extends BaseController {
    constructor(service, resourceName) {
        super(service, resourceName);
    }

    // 這裡可以添加特定於 User 的方法
    async delete(req, res) {
        try {
            const userId = req.params.id;
            const deletedUser = await this.service.delete(userId);
            if (!deletedUser) {
                return responseUtils.notFound(res, `User not found`);
            }

            return responseUtils.noContent(res, `User with ID ${userId} deleted successfully`);
        } catch (error) {
            logger.error(`Error deleting user with ID ${req.params.id}:`, error);
            return responseUtils.error(res, `Error deleting user with ID ${req.params.id}`);
        }
    }
}

module.exports = new UserController(UserService, 'user');

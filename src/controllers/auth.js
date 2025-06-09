const logger = require('../utils/logger');
const AuthService = require('../services/auth');
const responseUtils = require('../utils/response');

class AuthController {
    constructor(service) {
        this.service = service;
    }

    // 這裡可以覆寫 BaseController 的方法，或添加 AuthController 特有的方法
    async register(req, res) {
        try {
            const { username, password } = req.body;

            const newUser = await AuthService.register(username, password);
            return responseUtils.created(
                res,
                {
                    id: newUser._id,
                    username: newUser.username,
                },
                'User registered successfully'
            );
        } catch (error) {
            logger.error('Error in register:', error);

            if (error.message === 'User already exists') {
                return responseUtils.conflict(res, 'User already exists');
            }

            return responseUtils.error(res, 'Internal server error');
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;

            const jwtToken = await AuthService.login(username, password);
            if (!jwtToken) {
                return responseUtils.unauthorized(res, 'Invalid username or password');
            }
            return responseUtils.success(res, { token: jwtToken }, 'User logged in successfully');
        } catch (error) {
            logger.error('Error in login:', error);

            if (error.message === 'User not found' || error.message === 'Invalid password') {
                return responseUtils.unauthorized(res, 'Invalid username or password');
            }

            responseUtils.error(res, 'Internal server error');
        }
    }

    async changePassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = req.user.id;

            // 先在 controller 層檢查新舊密碼是否相同
            if (oldPassword === newPassword) {
                return responseUtils.badRequest(
                    res,
                    'New password cannot be the same as old password'
                );
            }

            await AuthService.changePassword(userId, oldPassword, newPassword);
            responseUtils.success(res, null, 'Password changed successfully');
        } catch (error) {
            logger.error('Error in changePassword:', error);

            if (error.message === 'User not found') {
                return responseUtils.notFound(res, 'User not found');
            } else if (error.message === 'New password cannot be the same as old password') {
                return responseUtils.badRequest(
                    res,
                    'New password cannot be the same as old password'
                );
            } else if (error.message === 'Invalid old password') {
                return responseUtils.unauthorized(res, 'Invalid old password');
            }

            responseUtils.error(res, 'Internal server error');
        }
    }
}

module.exports = new AuthController(AuthService);

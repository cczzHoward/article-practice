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
            )
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
            return responseUtils.success(
                res, 
                { token: jwtToken }, 
                'User logged in successfully'
            );
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

            // 使用 req.user._id 獲取當前用戶並更改密碼
            const userId = req.user._id; // 假設使用者 ID 存在於 req.user 中
            await AuthService.changePassword(userId, newPassword);
            responseUtils.success(
                res, 
                null,
                'Password changed successfully'
            );
        } catch (error) {
            logger.error('Error in changePassword:', error);

            if (error.message === 'User not found') {
                return responseUtils.notFound(res, 'User not found');
            };

            responseUtils.error(res, 'Internal server error');
        }
    }
}

module.exports = new AuthController(AuthService);
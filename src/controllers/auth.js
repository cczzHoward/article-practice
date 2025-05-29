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

            // 檢查用戶名和密碼是否存在
            if (!username || !password) {
                responseUtils.badRequest(res, 'Username and password are required');
            }

            const newUser = await AuthService.register(username, password);
            responseUtils.created(
                res, 
                {
                    id: newUser._id,
                    username: newUser.username,
                },
                'User registered successfully'
            )
        } catch (error) {
            logger.error('Error in register:', error);
            responseUtils.error(res, 'Internal server error');
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;

            // 檢查用戶名和密碼是否存在
            if (!username || !password) {
                responseUtils.badRequest(res, 'Username and password are required');
            }

            const jwtToken = await AuthService.login(username, password);
            if (!jwtToken) {
                responseUtils.unauthorized(res, 'Invalid username or password');
            }
            responseUtils.success(
                res, 
                { token: jwtToken }, 
                'User logged in successfully'
            );
        } catch (error) {
            logger.error('Error in login:', error);
            responseUtils.error(res, 'Internal server error');
        }
    }

    async changePassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;

            // 檢查舊密碼和新密碼是否存在
            if (!oldPassword || !newPassword) {
                responseUtils.badRequest(res, 'Old password and new password are required');
            }

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
            responseUtils.error(res, 'Internal server error');
        }
    }
}

module.exports = new AuthController(AuthService);
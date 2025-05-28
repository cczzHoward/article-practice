const logger = require('../utils/logger');
const AuthService = require('../services/auth');

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
                return res.status(400).json({ message: 'Username and password are required' });
            }

            const newUser = await AuthService.register(username, password);
            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: newUser._id,
                    username: newUser.username,
                },
            });
        } catch (error) {
            logger.error('Error in register:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;

            // 檢查用戶名和密碼是否存在
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' });
            }

            const jwtToken = await AuthService.login(username, password);
            if (!jwtToken) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            res.status(200).json({
                message: 'User logged in successfully',
                token: jwtToken
            });
        } catch (error) {
            logger.error('Error in login:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new AuthController(AuthService);
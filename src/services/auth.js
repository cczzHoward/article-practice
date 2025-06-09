const UserRepository = require('../repositories/user');
const BaseService = require('../base/baseService');
const jwt = require('jsonwebtoken');

class AuthService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    async register(username, password) {
        // 檢查用戶是否已存在，如果存在則返回錯誤
        const existingUser = await UserRepository.findByUsername(username);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // 創建新用戶
        const newUser = await UserRepository.create({
            username,
            password,
        });
        return newUser;
    }

    async login(username, password) {
        // 檢查用戶是否存在
        const user = await UserRepository.findByUsername(username);
        if (!user) {
            throw new Error('User not found');
        }

        // 檢查密碼是否正確
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        // 生成 JWT token
        const tokenObject = {
            id: user._id,
            username: user.username,
            role: user.role,
        };
        const jwtToken = jwt.sign(tokenObject, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION || '1h',
        });

        return jwtToken;
    }

    async changePassword(userId, oldPassword, newPassword) {
        // 先查出 user 實例
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // 驗證舊密碼
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            throw new Error('Invalid old password');
        }

        // 檢查新密碼是否與舊密碼相同
        if (oldPassword === newPassword) {
            throw new Error('New password cannot be the same as old password');
        }

        // 更新密碼
        user.password = newPassword;
        await user.save(); // 這裡會自動 hash 密碼
        return user;
    }
}

module.exports = new AuthService(UserRepository);

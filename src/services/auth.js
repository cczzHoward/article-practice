const UserRepository = require('../repositories/user');

const register = async (username, password) => {
    // 檢查用戶是否已存在，如果存在則返回錯誤
    const existingUser = await UserRepository.findByUsername(username);
    if (existingUser) {
        throw new Error('User already exists');
    }

    // 創建新用戶
    const newUser = await UserRepository.createUser({
        username,
        password,
    });
    return newUser;
}

module.exports = {
    register,
};
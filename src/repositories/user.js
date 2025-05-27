const UserModel = require('../models/user');

const findByUsername = async (username) => {
    const user = await UserModel.findOne({ username });
    return user;
};

const createUser = async (userData) => {
    const user = new UserModel(userData);
    await user.save();
    return user;
};

module.exports = {
    createUser,
    findByUsername,
};
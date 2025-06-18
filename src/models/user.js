const mongoose = require('mongoose');
const { Schema } = mongoose;
const connection = require('../database/dbConnection');
const bcrypt = require('bcrypt');
const BaseSchema = require('../base/baseSchema');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        min: 1,
        max: 64,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        min: 1,
        max: 64,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    // TODO: 更改成 snake_case 統一風格
    postedArticles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Article',
            default: [],
        },
    ],
});

userSchema.plugin(BaseSchema);

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Error comparing password');
    }
};

userSchema.pre('save', async function (next) {
    // TODO: 將雜湊密碼抽成一個 function (方便做 unit test)
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const UserModel = connection.model('User', userSchema);

module.exports = UserModel;

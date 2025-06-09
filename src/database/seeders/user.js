const UserModel = require('../../models/user');

const users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'test1234', password: 'test1234', role: 'user' },
    { username: 'jane', password: 'jane123', role: 'user' },
    { username: 'john', password: 'john123', role: 'user' },
    { username: 'alice', password: 'alice123', role: 'user' },
    { username: 'bob', password: 'bob123', role: 'user' },
    { username: 'charlie', password: 'charlie123', role: 'user' },
    { username: 'david', password: 'david123', role: 'user' },
    { username: 'eva', password: 'eva123', role: 'user' },
    { username: 'frank', password: 'frank123', role: 'user' },
];

async function seedUsers() {
    await UserModel.deleteMany({});
    for (const user of users) {
        // 這樣才會觸發 pre-save hash 密碼的 middleware
        await UserModel.create(user);
    }
    console.log('User seeding done!');
}

module.exports = seedUsers;

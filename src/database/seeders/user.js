const UserModel = require('../../models/user');

const users = [
    { username: 'admin', password: 'admin123' },
    { username: 'test123', password: 'test123' },
    { username: 'jane', password: 'jane123' },
    { username: 'john', password: 'john123' },
    { username: 'alice', password: 'alice123' },
    { username: 'bob', password: 'bob123' },
    { username: 'charlie', password: 'charlie123' },
    { username: 'david', password: 'david123' },
    { username: 'eva', password: 'eva123' },
    { username: 'frank', password: 'frank123' }
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
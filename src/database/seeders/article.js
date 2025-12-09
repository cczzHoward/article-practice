const { faker } = require('@faker-js/faker');
const ArticleModel = require('../../models/article');
const UserModel = require('../../models/user');
const CategoryModel = require('../../models/category');

async function seedArticles() {
    console.log('Seeding articles...');
    await ArticleModel.deleteMany({});

    // 取得所有 user 的 ObjectId
    const users = await UserModel.find({}, '_id');
    if (users.length === 0) {
        console.log('No users found. Skipping article seeding.');
        return;
    }

    // 取得所有 category 的 ObjectId
    const categories = await CategoryModel.find({}, '_id');
    if (categories.length === 0) {
        console.log('No categories found. Skipping article seeding.');
        return;
    }

    const articles = [];
    const articleCount = 50; // 生成 50 篇文章

    for (let i = 0; i < articleCount; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];

        // 生成 1-3 個隨機標籤
        const tags = [];
        const tagCount = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < tagCount; j++) {
            tags.push(faker.word.sample());
        }

        articles.push({
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs({ min: 3, max: 10 }, '\n\n'),
            author: randomUser._id,
            category: randomCategory._id,
            tags: tags,
            cover_image: faker.image.urlLoremFlickr({ category: 'technology' }),
            created_at: faker.date.past(),
            updated_at: faker.date.recent(),
        });
    }

    // 插入文章
    const insertedArticles = await ArticleModel.insertMany(articles);

    // 初始化所有作者的 postedArticles 欄位
    await UserModel.updateMany({}, { $set: { postedArticles: [] } });

    // 建立 userId -> [articleId, ...] 的對照表
    const userArticlesMap = {};
    insertedArticles.forEach((article) => {
        const authorId = article.author.toString();
        if (!userArticlesMap[authorId]) {
            userArticlesMap[authorId] = [];
        }
        userArticlesMap[authorId].push(article._id);
    });

    // 批次更新每個 user 的 postedArticles
    const updatePromises = Object.entries(userArticlesMap).map(([userId, articleIds]) =>
        UserModel.findByIdAndUpdate(userId, {
            $addToSet: { postedArticles: { $each: articleIds } },
        })
    );
    await Promise.all(updatePromises);

    console.log(`Article seeding done! Created ${insertedArticles.length} articles.`);
}

module.exports = seedArticles;

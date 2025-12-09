const CommentModel = require('../../models/comment');
const ArticleModel = require('../../models/article');
const UserModel = require('../../models/user');

async function seedComments() {
    const { faker } = await import('@faker-js/faker/locale/zh_TW');
    console.log('Seeding comments...');
    await CommentModel.deleteMany({});

    // 取得所有 user 的 ObjectId
    const users = await UserModel.find({}, '_id');
    if (users.length === 0) {
        console.log('No users found. Skipping comment seeding.');
        return;
    }

    // 取得所有 article 的 ObjectId
    const articles = await ArticleModel.find({}, '_id');
    if (articles.length === 0) {
        console.log('No articles found. Skipping comment seeding.');
        return;
    }

    const comments = [];
    const commentCount = 100; // 生成 100 則留言

    for (let i = 0; i < commentCount; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomArticle = articles[Math.floor(Math.random() * articles.length)];

        comments.push({
            content: faker.lorem.sentences(2), // 生成 2 句隨機留言
            article: randomArticle._id,
            user: randomUser._id,
            created_at: faker.date.recent(),
        });
    }

    const insertedComments = await CommentModel.insertMany(comments);

    // 初始化所有文章的評論欄位
    await ArticleModel.updateMany({}, { $set: { comments: [] } });

    // 建立 ArticleID => [CommentId, ...] 的對照表
    const articleCommentsMap = {};
    insertedComments.forEach((comment) => {
        const articleId = comment.article.toString();
        if (!articleCommentsMap[articleId]) {
            articleCommentsMap[articleId] = [];
        }
        articleCommentsMap[articleId].push(comment._id);
    });

    // 批次更新每篇文章的 comments 欄位
    const updatePromises = Object.entries(articleCommentsMap).map(([articleId, commentIds]) =>
        ArticleModel.findByIdAndUpdate(articleId, {
            $addToSet: { comments: { $each: commentIds } },
        })
    );
    await Promise.all(updatePromises);

    console.log(`Comment seeding done! Created ${insertedComments.length} comments.`);
}

module.exports = seedComments;

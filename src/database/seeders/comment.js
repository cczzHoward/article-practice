const CommentModel = require('../../models/comment');
const ArticleModel = require('../../models/article');
const UserModel = require('../../models/user');

const commentsData = [
    // 你可以根據實際文章標題與用戶名稱調整
    { article: 'Hello World', user: 'test1234', content: '很棒的文章！' },
    { article: 'Hello World', user: 'jane', content: '受益良多，謝謝分享。' },
    { article: 'Second Post', user: 'bob', content: '請問有範例程式碼嗎？' },
    { article: 'Node.js Tips', user: 'alice', content: 'Node.js 真的很實用！' },
    { article: 'MongoDB Guide', user: 'john', content: '期待更多資料庫相關內容。' },
    { article: 'Tech Trends 2024', user: 'admin', content: '趨勢分析很到位！' },
    { article: 'User Experience', user: 'eva', content: 'UX 很重要，推！' },
    { article: 'Security Basics', user: 'frank', content: '安全議題值得重視。' },
    { article: 'RESTful API Design', user: 'charlie', content: 'API 設計原則很實用。' },
    { article: 'Testing Strategies', user: 'david', content: '測試策略講得很清楚。' },
];

async function seedComments() {
    console.log('Seeding comments...');
    await CommentModel.deleteMany({});

    // 取得所有 user 的 ObjectId 對照表
    const users = await UserModel.find({}, 'username _id');
    const userMap = {};
    users.forEach((user) => {
        userMap[user.username] = user._id;
    });

    // 取得所有 article 的 ObjectId 對照表
    const articles = await ArticleModel.find({}, 'title _id');
    const articleMap = {};
    articles.forEach((article) => {
        articleMap[article.title] = article._id;
    });

    // 將 username/article 轉成 ObjectId
    const comments = commentsData.map((comment) => ({
        ...comment,
        article: articleMap[comment.article],
        user: userMap[comment.user],
    }));

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

    console.log('Comment seeding done!');
}

module.exports = seedComments;

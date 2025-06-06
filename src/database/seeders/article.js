const ArticleModel = require('../../models/article');
const UserModel = require('../../models/user');
const CategoryModel = require('../../models/category');

const articlesData = [
    { title: 'Hello World', author: 'admin', content: 'This is the first article.', category: '技術新知' },
    { title: 'Second Post', author: 'test1234', content: 'Another article content.', category: '技術新知' },
    { title: 'Tech Trends 2024', author: 'jane', content: 'Exploring the latest in technology for 2024.', category: '技術新知' },
    { title: 'Node.js Tips', author: 'john', content: 'Best practices for Node.js development.', category: '後端' },
    { title: 'MongoDB Guide', author: 'admin', content: 'A beginner\'s guide to MongoDB.', category: '資料庫' },
    { title: 'User Experience', author: 'alice', content: 'How to improve user experience in web apps.', category: '使用者體驗' },
    { title: 'Security Basics', author: 'bob', content: 'Essential security tips for developers.', category: '安全' },
    { title: 'Async Programming', author: 'charlie', content: 'Understanding async in JavaScript.', category: '後端' },
    { title: 'Database Indexing', author: 'david', content: 'Why and how to use indexes in MongoDB.', category: '資料庫' },
    { title: 'Frontend Frameworks', author: 'eva', content: 'Comparing React, Vue, and Angular.', category: '前端' },
    { title: 'Testing Strategies', author: 'frank', content: 'How to write effective tests.', category: '測試' },
    { title: 'RESTful API Design', author: 'admin', content: 'Principles and best practices for designing RESTful APIs.', category: 'API 設計' },
    { title: 'Express Middleware', author: 'bob', content: 'How to use and write custom middleware in Express.', category: '後端' },
    { title: 'Async/Await Patterns', author: 'charlie', content: 'Modern async programming patterns in JavaScript.', category: '後端' },
    { title: 'Frontend vs Backend', author: 'eva', content: 'Key differences and how they work together.', category: '技術新知' },
    { title: 'Unit Testing in Node.js', author: 'frank', content: 'A guide to writing unit tests for Node.js applications.', category: '測試' },
    { title: 'Authentication Strategies', author: 'alice', content: 'Comparing JWT, OAuth, and session-based authentication.', category: '安全' },
    { title: 'Error Handling', author: 'john', content: 'How to handle errors gracefully in web applications.', category: '後端' },
    { title: 'Database Relationships', author: 'david', content: 'Modeling one-to-many and many-to-many relationships in MongoDB.', category: '資料庫' },
    { title: 'Vue vs React', author: 'eva', content: 'A comparison of two popular frontend frameworks.', category: '前端' },
    { title: 'Continuous Integration', author: 'admin', content: 'Setting up CI/CD pipelines for Node.js projects.', category: '部署與維運' },
    { title: 'API Security', author: 'bob', content: 'Best practices for securing your APIs.', category: '安全' },
    { title: 'Performance Optimization', author: 'jane', content: 'Tips for optimizing Node.js application performance.', category: '部署與維運' },
    { title: 'Logging in Production', author: 'admin', content: 'How to implement effective logging in production environments.', category: '部署與維運' },
    { title: 'Responsive Design', author: 'alice', content: 'Techniques for building responsive web interfaces.', category: '前端' },
    { title: 'Schema Validation', author: 'john', content: 'Validating data with Mongoose schemas.', category: '資料庫' },
    { title: 'Pagination Techniques', author: 'charlie', content: 'Implementing efficient pagination in APIs.', category: 'API 設計' },
    { title: 'Deploying to Cloud', author: 'david', content: 'Steps to deploy Node.js apps to cloud platforms.', category: '部署與維運' },
    { title: 'State Management', author: 'eva', content: 'Managing state in large frontend applications.', category: '前端' },
    { title: 'API Rate Limiting', author: 'frank', content: 'How to prevent abuse with rate limiting strategies.', category: 'API 設計' },
];

async function seedArticles() {
    await ArticleModel.deleteMany({});

    // 取得所有 user 的 ObjectId 對照表
    const users = await UserModel.find({}, 'username _id');
    const userMap = {};
    users.forEach(user => {
        userMap[user.username] = user._id;
    });

    // 取得所有 category 的 ObjectId 對照表
    const categories = await CategoryModel.find({}, 'name _id');
    const categoryMap = {};
    categories.forEach(cat => {
        categoryMap[cat.name] = cat._id;
    });

    // 將 author 由 username 轉成 ObjectId，category 由名稱轉成 ObjectId
    const articles = articlesData.map(article => ({
        ...article,
        author: userMap[article.author],
        category: categoryMap[article.category],
    }));

    // 插入文章
    const insertedArticles = await ArticleModel.insertMany(articles);

    // 初始化所有作者的 postedArticles 欄位
    await UserModel.updateMany({},
        { $set: { postedArticles: [] } }
    );

    // 建立 userId -> [articleId, ...] 的對照表
    const userArticlesMap = {};
    insertedArticles.forEach(article => {
        const authorId = article.author.toString();
        if (!userArticlesMap[authorId]) {
            userArticlesMap[authorId] = [];
        }
        userArticlesMap[authorId].push(article._id);
    });

    // 批次更新每個 user 的 postedArticles
    const updatePromises = Object.entries(userArticlesMap).map(([userId, articleIds]) =>
        UserModel.findByIdAndUpdate(userId, { $addToSet: { postedArticles: { $each: articleIds } } })
    );
    await Promise.all(updatePromises);
    

    console.log('Article seeding done!');
}

module.exports = seedArticles;
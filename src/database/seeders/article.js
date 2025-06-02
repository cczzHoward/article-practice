const ArticleModel = require('../../models/article');
const UserModel = require('../../models/user');

const articlesData = [
    { title: 'Hello World', author: 'admin', content: 'This is the first article.' },
    { title: 'Second Post', author: 'test123', content: 'Another article content.' },
    { title: 'Tech Trends 2024', author: 'jane', content: 'Exploring the latest in technology for 2024.' },
    { title: 'Node.js Tips', author: 'john', content: 'Best practices for Node.js development.' },
    { title: 'MongoDB Guide', author: 'admin', content: 'A beginner\'s guide to MongoDB.' },
    { title: 'User Experience', author: 'alice', content: 'How to improve user experience in web apps.' },
    { title: 'Security Basics', author: 'bob', content: 'Essential security tips for developers.' },
    { title: 'Async Programming', author: 'charlie', content: 'Understanding async in JavaScript.' },
    { title: 'Database Indexing', author: 'david', content: 'Why and how to use indexes in MongoDB.' },
    { title: 'Frontend Frameworks', author: 'eva', content: 'Comparing React, Vue, and Angular.' },
    { title: 'Testing Strategies', author: 'frank', content: 'How to write effective tests.' },
    { title: 'RESTful API Design', author: 'admin', content: 'Principles and best practices for designing RESTful APIs.' },
    { title: 'Express Middleware', author: 'bob', content: 'How to use and write custom middleware in Express.' },
    { title: 'Async/Await Patterns', author: 'charlie', content: 'Modern async programming patterns in JavaScript.' },
    { title: 'Frontend vs Backend', author: 'eva', content: 'Key differences and how they work together.' },
    { title: 'Unit Testing in Node.js', author: 'frank', content: 'A guide to writing unit tests for Node.js applications.' },
    { title: 'Authentication Strategies', author: 'alice', content: 'Comparing JWT, OAuth, and session-based authentication.' },
    { title: 'Error Handling', author: 'john', content: 'How to handle errors gracefully in web applications.' },
    { title: 'Database Relationships', author: 'david', content: 'Modeling one-to-many and many-to-many relationships in MongoDB.' },
    { title: 'Vue vs React', author: 'eva', content: 'A comparison of two popular frontend frameworks.' },
    { title: 'Continuous Integration', author: 'admin', content: 'Setting up CI/CD pipelines for Node.js projects.' },
    { title: 'API Security', author: 'bob', content: 'Best practices for securing your APIs.' },
    { title: 'Performance Optimization', author: 'jane', content: 'Tips for optimizing Node.js application performance.' },
    { title: 'Logging in Production', author: 'admin', content: 'How to implement effective logging in production environments.' },
    { title: 'Responsive Design', author: 'alice', content: 'Techniques for building responsive web interfaces.' },
    { title: 'Schema Validation', author: 'john', content: 'Validating data with Mongoose schemas.' },
    { title: 'Pagination Techniques', author: 'charlie', content: 'Implementing efficient pagination in APIs.' },
    { title: 'Deploying to Cloud', author: 'david', content: 'Steps to deploy Node.js apps to cloud platforms.' },
    { title: 'State Management', author: 'eva', content: 'Managing state in large frontend applications.' },
    { title: 'API Rate Limiting', author: 'frank', content: 'How to prevent abuse with rate limiting strategies.' },
];

async function seedArticles() {
  await ArticleModel.deleteMany({});

  // 取得所有 user 的 ObjectId 對照表
  const users = await UserModel.find({}, 'username _id');
  const userMap = {};
  users.forEach(user => {
      userMap[user.username] = user._id;
  });

  // 將 author 由 username 轉成 ObjectId
  const articles = articlesData.map(article => ({
      ...article,
      author: userMap[article.author], // 轉成 ObjectId
  }));

  await ArticleModel.insertMany(articles);
  console.log('Article seeding done!');
}

module.exports = seedArticles;
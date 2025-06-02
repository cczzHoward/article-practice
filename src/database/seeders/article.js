const ArticleModel = require('../../models/article');

const articles = [
    { title: 'Hello World', author: 'admin', content: 'This is the first article.' },
    { title: 'Second Post', author: 'test123', content: 'Another article content.' },
    { title: 'Tech Trends 2024', author: 'jane', content: 'Exploring the latest in technology for 2024.' },
    { title: 'Node.js Tips', author: 'john', content: 'Best practices for Node.js development.' },
    { title: 'MongoDB Guide', author: 'admin', content: 'A beginner\'s guide to MongoDB.' }
];

async function seedArticles() {
  await ArticleModel.deleteMany({});
  await ArticleModel.insertMany(articles);
  console.log('Article seeding done!');
}

module.exports = seedArticles;
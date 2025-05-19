const ArticleModel = require('../models/article');

const getAllArticles = async () => {
    try {
        const articles = await ArticleModel.find();
        console.log('Articles fetched:', articles);
        return articles;
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw new Error('Internal server error');
    }
}

module.exports = {
    getAllArticles
};
const ArticleRepository = require('../repositories/article');

const getAllArticles = async () => {
    try {
        const articles = await ArticleRepository.getAllArticles();
        return articles;
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw new Error('Internal server error');
    }
}

module.exports = {
    getAllArticles
};
const logger = require('../utils/logger');
const ArticleRepository = require('../repositories/article');

const getArticleList = async () => {
    try {
        const articles = await ArticleRepository.getArticleList();
        return articles;
    } catch (error) {
        logger.error('Error fetching articles:', error);
        throw new Error('Internal server error');
    }
}

module.exports = {
    getArticleList
};
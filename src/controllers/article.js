const logger = require('../utils/logger');
const ArticleService = require('../services/article');

const getArticleList = async (req, res) => {
    try {
        const articles = await ArticleService.getArticleList();
        res.status(200).json(articles);
    } catch (error) {
        logger.error('Error fetching articles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getArticleList
};
const ArticleService = require('../services/article');

const getAllArticles = async (req, res) => {
    try {
        const articles = await ArticleService.getAllArticles();
        res.status(200).json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getAllArticles
};
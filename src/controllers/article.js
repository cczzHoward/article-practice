const logger = require('../utils/logger');
const ArticleService = require('../services/article');

// FIXME: error log 會有層層包覆的問題
const getArticleList = async (req, res) => {
    logger.info(`[GET] /api/v1/articles/list`);
    try {
        const articles = await ArticleService.getArticleList();
        res.status(200).json(articles);
    } catch (error) {
        logger.error('Error fetching articles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getArticleById = async (req, res) => {
    logger.info(`[GET] /api/v1/articles/${req.params.id}`);
    try {
        const article = await ArticleService.getArticleById(req.params.id);
        res.status(200).json(article);
    } catch (error) {
        logger.error('Error fetching article by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const createArticle =  async (req, res) => {
    logger.info(`[POST] /api/v1/articles`);
    try {
        const article = await ArticleService.createArticle(req.body);
        res.status(201).json(article);
    } catch (error) {
        logger.error('Error creating article:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateArticle = async (req, res) => {
    logger.info(`[PATCH] /api/v1/articles/${req.params.id}`);
    try {
        const article = await ArticleService.updateArticle(req.params.id, req.body);
        res.status(200).json(article);
    } catch (error) {
        logger.error('Error updating article:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const hardDeleteArticle = async (req, res) => {
    logger.info(`[DELETE] /api/v1/articles/${req.params.id}`);
    try {
        const article = await ArticleService.hardDeleteArticle(req.params.id);
        res.status(200).json(article);
    } catch (error) {
        logger.error('Error hard deleting article:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getArticleList,
    getArticleById,
    createArticle,
    updateArticle,
    hardDeleteArticle
};
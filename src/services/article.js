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

const getArticleById = async (id) => {
    try {
        const article = await ArticleRepository.getArticleById(id);
        if (!article) {
            throw new Error('Article not found');
        }
        return article;
    } catch (error) {
        logger.error('Error fetching article by ID:', error);
        throw new Error('Internal server error');
    }
}

const createArticle = async (articleData) => {
    try {
        const article = await ArticleRepository.createArticle(articleData);
        return article;
    } catch (error) {
        logger.error('Error creating article:', error);
        throw new Error('Internal server error');
    }
}

const updateArticle = async (id, articleData) => {
    try {
        const article = await ArticleRepository.updateArticle(id, articleData);
        if (!article) {
            throw new Error('Article not found');
        }
        return article;
    } catch (error) {
        logger.error('Error updating article:', error);
        throw new Error('Internal server error');
    }
}

const hardDeleteArticle = async (id) => {
    try {
        const article = await ArticleRepository.hardDeleteArticle(id);
        if (!article) {
            throw new Error('Article not found');
        }
        return article;
    } catch (error) {
        logger.error('Error hard deleting article:', error);
        throw new Error('Internal server error');
    }
}

module.exports = {
    getArticleList,
    getArticleById,
    createArticle,
    updateArticle,
    hardDeleteArticle
};
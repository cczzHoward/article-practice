const logger = require('../utils/logger');
const ArticleModel = require('../models/article');

const getArticleList = async () => {
    try {
        const articles = await ArticleModel.find();
        return articles;
    } catch (error) {
        logger.error('Error fetching articles:', error);
        throw new Error('Internal server error');
    }
}

const getArticleById = async (id) => {
    try {
        const article = await ArticleModel.findById(id);
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
        const article = new ArticleModel(articleData);
        await article.save();
        return article;
    } catch (error) {
        logger.error('Error creating article:', error);
        throw new Error('Internal server error');
    }
}

const updateArticle = async (id, articleData) => {
    try {
        articleData.updateAt = new Date();
        const article = await ArticleModel.findByIdAndUpdate(id, articleData, { new: true });
        if (!article) {
            throw new Error('Article not found');
        }
        return article;
    }
    catch (error) {
        logger.error('Error updating article:', error);
        throw new Error('Internal server error');
    }
}

const hardDeleteArticle = async (id) => {
    try {
        const article = await ArticleModel.findByIdAndDelete(id);
        if (!article) {
            throw new Error('Article not found');
        }
        return article;
    } catch (error) {
        logger.error('Error hard deleting article:', error);
        throw new Error('Internal server error');
    }
}

const softDeleteArticle = async (id) => {
    try {
        const article = await ArticleModel.findByIdAndUpdate(id, { deleted: true }, { new: true });
        if (!article) {
            throw new Error('Article not found');
        }
        return article;
    } catch (error) {
        logger.error('Error soft deleting article:', error);
        throw new Error('Internal server error');
    }
}

module.exports = {
    getArticleList,
    getArticleById,
    createArticle,
    updateArticle,
    hardDeleteArticle,
    softDeleteArticle
};
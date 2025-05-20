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

const getArticleById = async (id) => {
    try {
        const article = await ArticleModel.findById(id);
        if (!article) {
            throw new Error('Article not found');
        }
        return article;
    } catch (error) {
        console.error('Error fetching article:', error);
        throw new Error('Internal server error');
    }
}

const createArticle = async (articleData) => {
    try {
        const article = new ArticleModel(articleData);
        await article.save();
        return article;
    } catch (error) {
        console.error('Error creating article:', error);
        throw new Error('Internal server error');
    }
}

const updateArticle = async (id, articleData) => {
    try {
        const article = await ArticleModel.findByIdAndUpdate(id, articleData, { new: true });
        if (!article) {
            throw new Error('Article not found');
        }
        return article;
    }
    catch (error) {
        console.error('Error updating article:', error);
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
        console.error('Error deleting article:', error);
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
        console.error('Error soft deleting article:', error);
        throw new Error('Internal server error');
    }
}

module.exports = {
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    hardDeleteArticle,
    softDeleteArticle
};
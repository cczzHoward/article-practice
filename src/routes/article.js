const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const ArticleController = require('../controllers/article');

// 取得文章列表
router.get('/list', (req, res) => {
    ArticleController.getArticleList(req, res);
});

// 取得文章詳細內容
router.get('/:id', (req, res) => {
    ArticleController.getArticleById(req, res);
});

// 新增文章
router.post('/', (req, res) => {
    ArticleController.createArticle(req, res);
});

// 更新文章
router.patch('/:id', (req, res) => {
    ArticleController.updateArticle(req, res);
});

// 刪除文章(hard delete)
router.delete('/:id', (req, res) => {
    ArticleController.hardDeleteArticle(req, res);
});

module.exports = router;
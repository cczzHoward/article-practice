const express = require('express');
const router = express.Router();

const ArticleController = require('../controllers/article');

// 取得文章列表
router.get('/list', (req, res) => {
    ArticleController.getArticleList(req, res);
});

module.exports = router;
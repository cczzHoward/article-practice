const express = require('express');
const router = express.Router();

const ArticleController = require('../controllers/article');

router.get('/', (req, res) => {
    ArticleController.getAllArticles(req, res);
});

module.exports = router;
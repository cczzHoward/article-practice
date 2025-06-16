const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/article');
const passportMiddleware = require('../middlewares/passport');
const validate = require('../validators/validate');
const ArticleValidator = require('../validators/article');
const CommonValidator = require('../validators/common');
const { isArticleSelfOrAdmin } = require('../middlewares/auth');

// 取得文章列表
router.get(
    '/list',
    validate(ArticleValidator.getAllArticlesSchema, 'query'),
    ArticleController.getAll
);

// 取得文章詳細內容
router.get('/:id', validate(CommonValidator.objectIdSchema, 'params'), ArticleController.getById);

// 以下路由需要身份驗證
router.use(passportMiddleware.authenticate('jwt', { session: false }));

// 新增文章
router.post('/', validate(ArticleValidator.createArticleSchema), ArticleController.create);

// 更新文章
router.patch(
    '/:id',
    validate(CommonValidator.objectIdSchema, 'params'),
    validate(ArticleValidator.updateArticleSchema),
    isArticleSelfOrAdmin,
    ArticleController.update
);

// 刪除文章(hard delete)
router.delete(
    '/:id',
    validate(CommonValidator.objectIdSchema, 'params'),
    isArticleSelfOrAdmin,
    ArticleController.delete
);

module.exports = router;

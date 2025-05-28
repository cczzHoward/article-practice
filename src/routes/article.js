const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/article');
const passportMiddleware = require('../middlewares/passport');

// 取得文章列表
router.get('/list',
    ArticleController.getAll,
);

// 取得文章詳細內容
router.get('/:id',
    ArticleController.getById,
);

// 以下路由需要身份驗證
router.use(passportMiddleware.authenticate('jwt', { session: false }));

// 新增文章
router.post('/',
    ArticleController.create,
);

// 更新文章
router.patch('/:id',
    ArticleController.update,
);

// 刪除文章(hard delete)
router.delete('/:id',
    ArticleController.delete,
);

module.exports = router;
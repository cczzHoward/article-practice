const express = require('express');
const router = express.Router();
const passportMiddleware = require('../middlewares/passport');
const CommentController = require('../controllers/comment');
const validate = require('../validators/validate');
const CommentValidator = require('../validators/comment');
const CommonValidator = require('../validators/common');

// 以下路由需要身份驗證
router.use(passportMiddleware.authenticate('jwt', { session: false }));

// 發布留言
router.post(
    '/:id',
    validate(CommonValidator.objectIdSchema, 'params'),
    validate(CommentValidator.postCommentSchema),
    CommentController.create
);

// 刪除留言
router.delete('/:id', validate(CommonValidator.objectIdSchema, 'params'), CommentController.delete);

module.exports = router;

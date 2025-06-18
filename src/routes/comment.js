const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/comment');
const validate = require('../validators/validate');

router.use(passportMiddleware.authenticate('jwt', { session: false }));

// 發布留言
router.post('/', CommentController.create);

// 刪除留言
router.delete('/:id', CommentController.delete);

module.exports = router;

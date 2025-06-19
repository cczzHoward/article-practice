const CommentService = require('../services/comment');
const BaseController = require('../base/baseController');
const logger = require('../utils/logger');
const responseUtils = require('../utils/response');

class CommentController extends BaseController {
    constructor(service) {
        super(service);
    }

    async create(req, res) {
        try {
            const { content } = req.body;
            const articleId = req.params.id;
            const userId = req.user.id;
            const commentData = {
                article: articleId,
                user: userId,
                content,
            };

            const comment = await this.service.createCommentWithTx(commentData);
            return responseUtils.created(res, comment, 'Comment created successfully');
        } catch (error) {
            logger.error('Error in create comment:', error);

            if (error.message === 'Article not found') {
                return responseUtils.notFound(res, 'Article not found');
            }

            return responseUtils.error(res, 'Internal server error');
        }
    }

    async delete(req, res) {
        try {
            const commentId = req.params.id;
            const userId = req.user.id;

            const result = await this.service.deleteCommentWithTx(commentId, userId);
            return responseUtils.success(res, null, 'Comment deleted successfully');
        } catch (error) {
            logger.error('Error in delete comment:', error);

            if (error.message.includes('Comment not found')) {
                return responseUtils.notFound(res, 'Comment not found');
            } else if (
                error.message.includes('You do not have permission to delete this comment')
            ) {
                return responseUtils.forbidden(
                    res,
                    'You do not have permission to delete this comment'
                );
            }

            return responseUtils.error(res, 'Internal server error');
        }
    }
    // 可以在這裡添加 CommentController 特有的方法
}

module.exports = new CommentController(CommentService, 'comment');

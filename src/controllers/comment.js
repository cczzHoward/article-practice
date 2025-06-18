const CommentService = require('../services/comment');
const BaseController = require('../base/baseController');

class CommentController extends BaseController {
    constructor(service) {
        super(service);
    }

    // 可以在這裡添加 CommentController 特有的方法
}

module.exports = new CommentController(CommentService, 'comment');

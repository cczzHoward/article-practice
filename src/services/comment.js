const CommentRepository = require('../repositories/comment');
const BaseService = require('../base/baseService');

class CommentService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    // 可以在這裡添加 CommentService 特有的方法
}

module.exports = new CommentService(CommentRepository);

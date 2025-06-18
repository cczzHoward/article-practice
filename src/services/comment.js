const CommentRepository = require('../repositories/comment');
const BaseService = require('../base/baseService');
const ArticleRepository = require('../repositories/article');
const conn = require('../database/dbConnection');

class CommentService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    // 可以在這裡添加 CommentService 特有的方法
    async createCommentWithTx(commentData) {
        let session;
        try {
            session = await conn.startSession();
            session.startTransaction();

            // 檢查文章是否存在
            const article = await ArticleRepository.findById(commentData.article);
            if (!article) {
                throw new Error('Article not found');
            }

            // 創建評論
            const createdComment = await this.repository.create(commentData, { session });

            // 將評論 ID 添加到文章的 comments 中
            await ArticleRepository.addCommentToArticle(commentData.article, createdComment._id, {
                session,
            });
            await session.commitTransaction();

            return createdComment;
        } catch (err) {
            await session.abortTransaction();
            throw new Error(`Transaction failed: ${err.message}`);
        } finally {
            session.endSession();
        }
    }
}

module.exports = new CommentService(CommentRepository);

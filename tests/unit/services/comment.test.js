const CommentService = require('../../../src/services/comment');
const CommentRepository = require('../../../src/repositories/comment');
const ArticleRepository = require('../../../src/repositories/article');
const conn = require('../../../src/database/dbConnection');

jest.mock('../../../src/repositories/comment');
jest.mock('../../../src/repositories/article');

describe('CommentService', () => {
    describe('createCommentWithTx', () => {
        let mockSession;

        beforeEach(() => {
            mockSession = {
                startTransaction: jest.fn(),
                commitTransaction: jest.fn().mockResolvedValue(),
                abortTransaction: jest.fn().mockResolvedValue(),
                endSession: jest.fn(),
            };
            conn.startSession = jest.fn().mockResolvedValue(mockSession);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should create a comment and add it to the article in a transaction', async () => {
            // Arrange
            const mockCommentData = {
                content: 'This is a comment',
                article: 'articleId123',
            };
            const mockArticle = { _id: 'articleId123' };
            const mockCreatedComment = {
                _id: 'commentId123',
                content: 'This is a comment',
                article: 'articleId123',
            };
            ArticleRepository.findById.mockResolvedValue(mockArticle);
            CommentRepository.create.mockResolvedValue(mockCreatedComment);
            ArticleRepository.addCommentToArticle.mockResolvedValue();

            // Act
            const result = await CommentService.createCommentWithTx(mockCommentData);

            // Assert
            expect(conn.startSession).toHaveBeenCalled();
            expect(mockSession.startTransaction).toHaveBeenCalled();
            expect(ArticleRepository.findById).toHaveBeenCalledWith(mockCommentData.article);
            expect(CommentRepository.create).toHaveBeenCalledWith(mockCommentData, {
                session: mockSession,
            });
            expect(ArticleRepository.addCommentToArticle).toHaveBeenCalledWith(
                mockCommentData.article,
                mockCreatedComment._id,
                { session: mockSession }
            );
            expect(mockSession.commitTransaction).toHaveBeenCalled();
            expect(result).toEqual(mockCreatedComment);
        });

        it('should throw an error if the article does not exist', async () => {
            // Arrange
            const mockCommentData = {
                content: 'This is a comment',
                article: 'articleId123',
            };
            ArticleRepository.findById.mockResolvedValue(null);

            // Act
            const result = CommentService.createCommentWithTx(mockCommentData);

            // Assert
            await expect(result).rejects.toThrow('Article not found');
            expect(mockSession.abortTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
        });

        it('should abort transaction and throw error if any operation fails', async () => {
            // Arrange
            const mockCommentData = {
                content: 'This is a comment',
                article: 'articleId123',
            };
            const mockError = new Error('Database error');
            ArticleRepository.findById.mockResolvedValue({ _id: 'articleId123' });
            CommentRepository.create.mockRejectedValue(mockError);

            // Act
            const result = CommentService.createCommentWithTx(mockCommentData);

            // Assert
            await expect(result).rejects.toThrow('Transaction failed: Database error');
            expect(mockSession.abortTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
        });
    });
    describe('deleteCommentWithTx', () => {
        let mockSession;

        beforeEach(() => {
            mockSession = {
                startTransaction: jest.fn(),
                commitTransaction: jest.fn().mockResolvedValue(),
                abortTransaction: jest.fn().mockResolvedValue(),
                endSession: jest.fn(),
            };
            conn.startSession = jest.fn().mockResolvedValue(mockSession);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should delete a comment and remove it from the article in a transaction', async () => {
            // Arrange
            const mockCommentId = 'commentId123';
            const mockUserId = 'userId123';

            CommentRepository.findById.mockResolvedValue({
                _id: mockCommentId,
                user: { _id: mockUserId },
                article: { _id: 'articleId123' },
            });

            CommentRepository.delete.mockResolvedValue();
            ArticleRepository.removeCommentFromArticle.mockResolvedValue();

            // Act
            const result = await CommentService.deleteCommentWithTx(mockCommentId, mockUserId);

            // Assert
            expect(conn.startSession).toHaveBeenCalled();
            expect(CommentRepository.findById).toHaveBeenCalledWith(mockCommentId);
            expect(CommentRepository.delete).toHaveBeenCalledWith(mockCommentId, {
                session: expect.any(Object),
            });
            expect(ArticleRepository.removeCommentFromArticle).toHaveBeenCalledWith(
                'articleId123',
                mockCommentId,
                { session: expect.any(Object) }
            );
            expect(result).toBe(true);
            expect(mockSession.commitTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
        });

        it('should throw an error if the comment does not exist', async () => {
            // Arrange
            const mockCommentId = 'commentId123';
            const mockUserId = 'userId123';

            CommentRepository.findById.mockResolvedValue(null);

            // Act
            const result = CommentService.deleteCommentWithTx(mockCommentId, mockUserId);

            // Assert
            await expect(result).rejects.toThrow('Comment not found');
            expect(mockSession.abortTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
        });

        it('should throw an error if the user does not have permission to delete the comment', async () => {
            // Arrange
            const mockCommentId = 'commentId123';
            const mockUserId = 'userId123';

            CommentRepository.findById.mockResolvedValue({
                _id: mockCommentId,
                user: { _id: 'anotherUserId' },
                article: { _id: 'articleId123' },
            });

            // Act
            const result = CommentService.deleteCommentWithTx(mockCommentId, mockUserId);

            // Assert
            await expect(result).rejects.toThrow(
                'You do not have permission to delete this comment'
            );
            expect(mockSession.abortTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
        });

        it('should abort transaction and throw error if any operation fails', async () => {
            // Arrange
            const mockCommentId = 'commentId123';
            const mockUserId = 'userId123';
            const mockError = new Error('Database error');
            CommentRepository.findById.mockResolvedValue({
                _id: mockCommentId,
                user: { _id: mockUserId },
                article: { _id: 'articleId123' },
            });
            CommentRepository.delete.mockRejectedValue(mockError);

            // Act
            const result = CommentService.deleteCommentWithTx(mockCommentId, mockUserId);

            // Assert
            await expect(result).rejects.toThrow('Transaction failed: Database error');
            expect(mockSession.abortTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
        });
    });
});

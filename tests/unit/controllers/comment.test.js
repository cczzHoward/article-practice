const CommentController = require('../../../src/controllers/comment');
const CommentService = require('../../../src/services/comment');

jest.mock('../../../src/services/comment');

describe('CommentController', () => {
    describe('create', () => {
        it('should create a comment successfully', async () => {
            // Arrange
            const mockReq = {
                body: { content: 'This is a comment' },
                params: { id: 'articleId123' },
                user: { id: 'userId123' },
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockComment = {
                id: 'commentId123',
                content: 'This is a comment',
                article: 'articleId123',
            };
            CommentService.createCommentWithTx.mockResolvedValue(mockComment);

            // Act
            await CommentController.create(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockComment,
                message: 'Comment created successfully',
            });
        });

        it('should return 404 if article not found', async () => {
            // Arrange
            const mockReq = {
                body: { content: 'This is a comment' },
                params: { id: 'articleId123' },
                user: { id: 'userId123' },
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            CommentService.createCommentWithTx.mockRejectedValue(new Error('Article not found'));

            // Act
            await CommentController.create(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                data: null,
                message: 'Article not found',
            });
        });

        it('should return 500 on internal server error', async () => {
            // Arrange
            const mockReq = {
                body: { content: 'This is a comment' },
                params: { id: 'articleId123' },
                user: { id: 'userId123' },
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            CommentService.createCommentWithTx.mockRejectedValue(
                new Error('Internal server error')
            );

            // Act
            await CommentController.create(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                data: null,
                message: 'Internal server error',
            });
        });
    });

    describe('delete', () => {
        it('should delete a comment successfully', async () => {
            // Arrange
            const mockReq = {
                params: { id: 'commentId123' },
                user: { id: 'userId123' },
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            CommentService.deleteCommentWithTx.mockResolvedValue();

            // Act
            await CommentController.delete(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.send).toHaveBeenCalled();
        });

        it('should return 404 if comment not found', async () => {
            // Arrange
            const mockReq = {
                params: { id: 'commentId123' },
                user: { id: 'userId123' },
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            CommentService.deleteCommentWithTx.mockRejectedValue(new Error('Comment not found'));

            // Act
            await CommentController.delete(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                data: null,
                message: 'Comment not found',
            });
        });

        it('should return 403 if user does not have permission to delete comment', async () => {
            // Arrange
            const mockReq = {
                params: { id: 'commentId123' },
                user: { id: 'userId123' },
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            CommentService.deleteCommentWithTx.mockRejectedValue(
                new Error('You do not have permission to delete this comment')
            );

            // Act
            await CommentController.delete(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                data: null,
                message: 'You do not have permission to delete this comment',
            });
        });

        it('should return 500 on internal server error during delete', async () => {
            // Arrange
            const mockReq = {
                params: { id: 'commentId123' },
                user: { id: 'userId123' },
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            CommentService.deleteCommentWithTx.mockRejectedValue(
                new Error('Internal server error')
            );

            // Act
            await CommentController.delete(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                data: null,
                message: 'Internal server error',
            });
        });
    });
});

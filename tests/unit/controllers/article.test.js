const ArticleController = require('../../../src/controllers/article');
const ArticleService = require('../../../src/services/article');

jest.mock('../../../src/services/article');

describe('ArticleController', () => {
    describe('getAll', () => {
        it('should return 200 and articles list', async () => {
            // Arrange
            const mockReq = { query: {} };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            ArticleService.searchAndPaginate.mockResolvedValue({ data: [], total: 0 });

            // Act
            await ArticleController.getAll(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should return 500 if service throws error', async () => {
            // Arrange
            const mockReq = { query: {} };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            ArticleService.searchAndPaginate.mockRejectedValue(new Error('DB error'));

            // Act
            await ArticleController.getAll(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
        });
    });

    describe('getById', () => {
        it('should return 200 and article by ID', async () => {
            // Arrange
            const mockReq = { params: { id: '123' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            ArticleService.findById.mockResolvedValue({ id: '123', title: 'Test Article' });

            // Act
            await ArticleController.getById(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should return 404 if article not found', async () => {
            // Arrange
            const mockReq = { params: { id: 'nonexistentId' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            ArticleService.findById.mockResolvedValue(null);

            // Act
            await ArticleController.getById(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: `${ArticleController.resourceName} not found`,
                })
            );
        });

        it('should return 500 if service throws error', async () => {
            // Arrange
            const mockReq = { params: { id: '123' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            ArticleService.findById.mockRejectedValue(new Error('DB error'));

            // Act
            await ArticleController.getById(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
        });
    });

    describe('create', () => {
        it('should return 201 and created article', async () => {
            // Arrange
            const mockReq = {
                body: {
                    title: 'Test Article',
                    content: 'This is a test article.',
                    category: 'Test Category',
                },
                user: { id: 'authorId' },
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            ArticleService.getCategoryIdByName.mockResolvedValue({ _id: 'categoryId' });
            ArticleService.createWithTx.mockResolvedValue({
                _id: 'articleId',
                title: 'Test Article',
            });
            // Act
            await ArticleController.create(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: { _id: 'articleId', title: 'Test Article' },
                })
            );
        });

        it('should return 400 if category not found', async () => {
            // Arrange
            const mockReq = {
                body: {
                    title: 'Test Article',
                    content: 'This is a test article.',
                    category: 'Nonexistent Category',
                },
                user: { id: 'authorId' },
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            ArticleService.getCategoryIdByName.mockResolvedValue(null);

            // Act
            await ArticleController.create(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: false, message: 'Category not found' })
            );
        });

        it('should return 500 if service throws error', async () => {
            // Arrange
            const mockReq = {
                body: {
                    title: 'Test Article',
                    content: 'This is a test article.',
                    category: 'Test Category',
                },
                user: { id: 'authorId' },
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            ArticleService.getCategoryIdByName.mockRejectedValue(new Error('DB error'));

            // Act
            await ArticleController.create(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
        });
    });

    describe('update', () => {
        it('should return 200 and updated article', async () => {
            // Arrange
            const mockReq = {
                params: { id: 'articleId' },
                body: { title: 'Updated Title' },
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            ArticleService.findById.mockResolvedValue({ _id: 'articleId', title: 'Old Title' });
            ArticleService.update.mockResolvedValue({ _id: 'articleId', title: 'Updated Title' });

            // Act
            await ArticleController.update(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: { _id: 'articleId', title: 'Updated Title' },
                })
            );
        });

        it('should return 404 if article not found', async () => {
            // Arrange
            const mockReq = {
                params: { id: 'nonexistentId' },
                body: { title: 'Updated Title' },
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            ArticleService.findById.mockResolvedValue(null);

            // Act
            await ArticleController.update(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: false, message: 'article not found' })
            );
        });

        it('should return 500 if service throws error', async () => {
            // Arrange
            const mockReq = {
                params: { id: 'articleId' },
                body: { title: 'Updated Title' },
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            ArticleService.findById.mockRejectedValue(new Error('DB error'));

            // Act
            await ArticleController.update(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
        });
    });

    describe('delete', () => {
        it('should return 204 on successful deletion', async () => {
            // Arrange
            const mockReq = { params: { id: 'articleId' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            ArticleService.findById.mockResolvedValue({
                _id: 'articleId',
                author: { _id: 'authorId' },
            });
            ArticleService.deleteWithTx.mockResolvedValue({ _id: 'articleId' });

            // Act
            await ArticleController.delete(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.send).toHaveBeenCalled();
        });

        it('should return 404 if article not found', async () => {
            // Arrange
            const mockReq = { params: { id: 'nonexistentId' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            ArticleService.findById.mockResolvedValue(null);

            // Act
            await ArticleController.delete(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: false, message: 'article not found' })
            );
        });

        it('should return 500 if service throws error', async () => {
            // Arrange
            const mockReq = { params: { id: 'articleId' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            ArticleService.findById.mockRejectedValue(new Error('DB error'));

            // Act
            await ArticleController.delete(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
        });
    });
});

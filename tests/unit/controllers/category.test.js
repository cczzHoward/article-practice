const CategoryController = require('../../../src/controllers/category');
const CategoryService = require('../../../src/services/category');

jest.mock('../../../src/services/category');

describe('CategoryController', () => {
    describe('getAll', () => {
        it('should return 200 and users list', async () => {
            // Arrange
            const mockReq = { query: {} };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            CategoryService.findAll.mockResolvedValue({ data: [], total: 0 });

            // Act
            await CategoryController.getAll(mockReq, mockRes);

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
            CategoryService.findAll.mockRejectedValue(new Error('DB error'));

            // Act
            await CategoryController.getAll(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: `Error fetching ${CategoryController.resourceName} list`,
                    success: false,
                })
            );
        });
    });

    describe('getById', () => {
        it('should return 200 and category by ID', async () => {
            // Arrange
            const mockReq = { params: { id: '123' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            CategoryService.findById.mockResolvedValue({ id: '123', name: 'Test Category' });

            // Act
            await CategoryController.getById(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should return 404 if category not found', async () => {
            // Arrange
            const mockReq = { params: { id: '123' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            CategoryService.findById.mockResolvedValue(null);

            // Act
            await CategoryController.getById(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: `${CategoryController.resourceName} not found`,
                    success: false,
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
            CategoryService.findById.mockRejectedValue(new Error('DB error'));

            // Act
            await CategoryController.getById(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: `Error fetching ${CategoryController.resourceName} by ID`,
                    success: false,
                })
            );
        });
    });

    describe('create', () => {
        it('should return 201 and created category', async () => {
            // Arrange
            const mockReq = { body: { name: 'New Category' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            CategoryService.create.mockResolvedValue({ id: '123', name: 'New Category' });

            // Act
            await CategoryController.create(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: `${CategoryController.resourceName} created successfully`,
                    success: true,
                })
            );
        });

        it('should return 500 if service throws error', async () => {
            // Arrange
            const mockReq = { body: { name: 'New Category' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            CategoryService.create.mockRejectedValue(new Error('DB error'));

            // Act
            await CategoryController.create(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: `Error creating ${CategoryController.resourceName}`,
                    success: false,
                })
            );
        });
    });

    describe('update', () => {
        it('should return 200 and updated category', async () => {
            // Arrange
            const mockReq = { params: { id: '123' }, body: { name: 'Updated Category' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            CategoryService.update.mockResolvedValue({ id: '123', name: 'Updated Category' });

            // Act
            await CategoryController.update(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: `${CategoryController.resourceName} updated successfully`,
                    success: true,
                })
            );
        });

        it('should return 500 if service throws error', async () => {
            // Arrange
            const mockReq = { params: { id: '123' }, body: { name: 'Updated Category' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            CategoryService.update.mockRejectedValue(new Error('DB error'));

            // Act
            await CategoryController.update(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: `Error updating ${CategoryController.resourceName}`,
                    success: false,
                })
            );
        });
    });

    describe('delete', () => {
        it('should return 204 on successful deletion', async () => {
            // Arrange
            const mockReq = { params: { id: '123' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            CategoryService.delete.mockResolvedValue();

            // Act
            await CategoryController.delete(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.send).toHaveBeenCalled();
        });

        it('should return 500 if service throws error', async () => {
            // Arrange
            const mockReq = { params: { id: '123' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            CategoryService.delete.mockRejectedValue(new Error('DB error'));

            // Act
            await CategoryController.delete(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: `Error deleting ${CategoryController.resourceName}`,
                    success: false,
                })
            );
        });
    });
});

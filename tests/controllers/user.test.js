const UserController = require('../../src/controllers/user');
const UserService = require('../../src/services/user');

jest.mock('../../src/services/user');

describe('UserController', () => {
    describe('getAll', () => {
        it('should return 200 and users list', async () => {
            // Arrange
            const mockReq = { query: {} };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            UserService.findAll.mockResolvedValue({ data: [], total: 0 });

            // Act
            await UserController.getAll(mockReq, mockRes);

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
            UserService.findAll.mockRejectedValue(new Error('DB error'));

            // Act
            await UserController.getAll(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: `Error fetching ${UserController.resourceName} list`,
                    success: false,
                })
            );
        });
    });

    describe('getById', () => {
        it('should return 200 and user by ID', async () => {
            // Arrange
            const mockReq = { params: { id: '123' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            UserService.findById.mockResolvedValue({ id: '123', name: 'Test User' });

            // Act
            await UserController.getById(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should return 404 if user not found', async () => {
            // Arrange
            const mockReq = { params: { id: 'nonExistentUserId' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            UserService.findById.mockResolvedValue(null);

            // Act
            await UserController.getById(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: `${UserController.resourceName} not found`,
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
            UserService.findById.mockRejectedValue(new Error('DB error'));

            // Act
            await UserController.getById(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: `Error fetching ${UserController.resourceName} by ID`,
                    success: false,
                })
            );
        });
    });

    describe('create', () => {
        it('should return 201 and created user', async () => {
            // Arrange
            const mockReq = { body: { name: 'New User' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            UserService.create.mockResolvedValue({ id: 'newUserId', name: 'New User' });

            // Act
            await UserController.create(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should return 500 if service throws error', async () => {
            // Arrange
            const mockReq = { body: { name: 'New User' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            UserService.create.mockRejectedValue(new Error('DB error'));

            // Act
            await UserController.create(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: `Error creating ${UserController.resourceName}`,
                    success: false,
                })
            );
        });
    });

    describe('update', () => {
        it('should return 200 and updated user', async () => {
            // Arrange
            const mockReq = { params: { id: '123' }, body: { name: 'Updated User' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            UserService.update.mockResolvedValue({ id: '123', name: 'Updated User' });

            // Act
            await UserController.update(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('should return 500 if service throws error during update', async () => {
            // Arrange
            const mockReq = { params: { id: '123' }, body: { name: 'Updated User' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            UserService.update.mockRejectedValue(new Error('DB error'));

            // Act
            await UserController.update(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: `Error updating ${UserController.resourceName}`,
                    success: false,
                })
            );
        });
    });

    describe('delete', () => {
        it('should return 204 when user is deleted successfully', async () => {
            // Arrange
            const mockReq = { params: { id: 'userId' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            UserService.delete.mockResolvedValue({ id: 'userId' });

            // Act
            await UserController.delete(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.send).toHaveBeenCalled();
        });

        it('should return 404 when user is not found', async () => {
            // Arrange
            const mockReq = { params: { id: 'nonExistentUserId' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            UserService.delete.mockResolvedValue(null);

            // Act
            await UserController.delete(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: 'User not found', success: false })
            );
        });

        it('should return 500 when an error occurs', async () => {
            // Arrange
            const mockReq = { params: { id: 'userId' } };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            UserService.delete.mockRejectedValue(new Error('DB error'));

            // Act
            await UserController.delete(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Error deleting user with ID userId',
                })
            );
        });
    });
});

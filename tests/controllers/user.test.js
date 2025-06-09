const UserController = require('../../src/controllers/user');
const UserService = require('../../src/services/user');

jest.mock('../../src/services/user');

describe('UserController', () => {
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

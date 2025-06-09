const CategoryController = require('../../src/controllers/category');
const CategoryService = require('../../src/services/category');

jest.mock('../../src/services/category');

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
                expect.objectContaining({ message: 'Error fetching category list', success: false })
            );
        });
    });
});

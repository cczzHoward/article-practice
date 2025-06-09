const ArticleController = require('../../src/controllers/article');
const ArticleService = require('../../src/services/article');

jest.mock('../../src/services/article');

describe('ArticleController', () => {
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
});

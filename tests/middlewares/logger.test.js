const { logRequest } = require('../../src/middlewares/logger');
const logger = require('../../src/utils/logger');

describe('Logger Middleware', () => {
    let mockReq, mockRes, next;

    beforeEach(() => {
        mockReq = {
            method: 'GET',
            originalUrl: '/test-endpoint',
        };
        mockRes = {};
        next = jest.fn();
    });

    it('should log the request method and URL', () => {
        const logSpy = jest.spyOn(logger, 'info');

        logRequest(mockReq, mockRes, next);

        expect(logSpy).toHaveBeenCalledWith('[GET] /test-endpoint');
        expect(next).toHaveBeenCalled();

        logSpy.mockRestore();
    });
});

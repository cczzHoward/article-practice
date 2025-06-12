const {
    success,
    created,
    noContent,
    badRequest,
    unauthorized,
    forbidden,
    notFound,
    conflict,
    error,
} = require('../../../src/utils/response');

describe('Response Utils', () => {
    let res;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    it('success', () => {
        success(res, { data: 'test' }, 'Test message');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Test message',
            data: { data: 'test' },
        });
    });

    it('created', () => {
        created(res, { data: 'test' }, 'Created successfully');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Created successfully',
            data: { data: 'test' },
        });
    });

    it('noContent', () => {
        noContent(res, 'No content');
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it('badRequest', () => {
        badRequest(res, 'Bad request', { error: 'Invalid input' });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Bad request',
            data: { error: 'Invalid input' },
        });
    });

    it('unauthorized', () => {
        unauthorized(res, 'Unauthorized access');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Unauthorized access',
            data: null,
        });
    });

    it('forbidden', () => {
        forbidden(res, 'Forbidden access');
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Forbidden access',
            data: null,
        });
    });

    it('notFound', () => {
        notFound(res, 'Resource not found');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Resource not found',
            data: null,
        });
    });

    it('conflict', () => {
        conflict(res, 'Conflict occurred');
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Conflict occurred',
            data: null,
        });
    });

    it('error', () => {
        error(res, 'Internal server error', 500, { error: 'Server error' });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Internal server error',
            data: { error: 'Server error' },
        });
    });
});

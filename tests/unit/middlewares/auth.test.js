const {
    isAdmin,
    isArticleSelfOrAdmin,
    isUserSelfOrAdminButNotSelf,
} = require('../../../src/middlewares/auth');
const responseUtils = require('../../../src/utils/response');
const ArticleService = require('../../../src/services/article');

jest.mock('../../../src/utils/response');
jest.mock('../../../src/services/article');

describe('auth middleware', () => {
    describe('isAdmin', () => {
        it('should call next if user is admin', () => {
            const mockReq = { user: { role: 'admin' } };
            const mockRes = {};
            const next = jest.fn();

            isAdmin(mockReq, mockRes, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return forbidden if user is not admin', () => {
            const mockReq = { user: { role: 'user' } };
            const mockRes = {};
            const next = jest.fn();

            isAdmin(mockReq, mockRes, next);

            expect(responseUtils.forbidden).toHaveBeenCalledWith(
                mockRes,
                'You do not have permission to access this resource'
            );
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('isArticleSelfOrAdmin', () => {
        it('should call next if user is admin', async () => {
            const mockReq = {
                user: { role: 'admin', username: 'admin' },
                params: { id: '68491b9a31494240e0709b45' },
            };
            const mockRes = {};
            const next = jest.fn();
            ArticleService.findById.mockResolvedValue({ author: { username: 'someone' } });

            await isArticleSelfOrAdmin(mockReq, mockRes, next);

            expect(next).toHaveBeenCalled();
        });

        it('should call next if user is article author', async () => {
            const mockReq = {
                user: { role: 'user', username: 'author1' },
                params: { id: '68491b9a31494240e0709b45' },
            };
            const mockRes = {};
            const next = jest.fn();
            ArticleService.findById.mockResolvedValue({ author: { username: 'author1' } });

            await isArticleSelfOrAdmin(mockReq, mockRes, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return notFound if article does not exist', async () => {
            const mockReq = {
                user: { role: 'user', username: 'author1' },
                params: { id: '68491b9a31494240e0709b45' },
            };
            const mockRes = {};
            const next = jest.fn();
            ArticleService.findById.mockResolvedValue(null);

            await isArticleSelfOrAdmin(mockReq, mockRes, next);

            expect(responseUtils.notFound).toHaveBeenCalledWith(mockRes, 'Article not found');
            expect(next).not.toHaveBeenCalled();
        });

        it('should return forbidden if user is not admin or author', async () => {
            const mockReq = {
                user: { role: 'user', username: 'notAuthor' },
                params: { id: 'articleId' },
            };
            const mockRes = {};
            const next = jest.fn();
            ArticleService.findById.mockResolvedValue({ author: { username: 'author1' } });

            await isArticleSelfOrAdmin(mockReq, mockRes, next);

            expect(responseUtils.forbidden).toHaveBeenCalledWith(
                mockRes,
                'You do not have permission to access this resource'
            );
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('isUserSelfOrAdminButNotSelf', () => {
        it('should call next if admin and not self', () => {
            const mockReq = { user: { role: 'admin', id: '1' }, params: { id: '2' } };
            const mockRes = {};
            const next = jest.fn();

            isUserSelfOrAdminButNotSelf(mockReq, mockRes, next);

            expect(next).toHaveBeenCalled();
        });

        it('should call next if user is self', () => {
            const mockReq = { user: { role: 'user', id: '1' }, params: { id: '1' } };
            const mockRes = {};
            const next = jest.fn();

            isUserSelfOrAdminButNotSelf(mockReq, mockRes, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return forbidden if admin tries to delete self', () => {
            const mockReq = { user: { role: 'admin', id: '1' }, params: { id: '1' } };
            const mockRes = {};
            const next = jest.fn();

            isUserSelfOrAdminButNotSelf(mockReq, mockRes, next);

            expect(responseUtils.forbidden).toHaveBeenCalledWith(
                mockRes,
                'You do not have permission to delete this user'
            );
            expect(next).not.toHaveBeenCalled();
        });

        it('should return forbidden if user tries to delete others', () => {
            const mockReq = { user: { role: 'user', id: '1' }, params: { id: '2' } };
            const mockRes = {};
            const next = jest.fn();

            isUserSelfOrAdminButNotSelf(mockReq, mockRes, next);

            expect(responseUtils.forbidden).toHaveBeenCalledWith(
                mockRes,
                'You do not have permission to delete this user'
            );
            expect(next).not.toHaveBeenCalled();
        });
    });
});

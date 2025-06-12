const ArticleService = require('../../../src/services/article');
const ArticleRepository = require('../../../src/repositories/article');
const CategoryRepository = require('../../../src/repositories/category');
const UserRepository = require('../../../src/repositories/user');
const conn = require('../../../src/database/dbConnection');

jest.mock('../../../src/repositories/article');
jest.mock('../../../src/repositories/category');
jest.mock('../../../src/repositories/user');

describe('ArticleService', () => {
    describe('findAll', () => {
        it('should return all articles', async () => {
            // Arrange
            const mockData = [{ title: 'Test Article' }];
            ArticleRepository.findAll.mockResolvedValue(mockData);

            // Act
            const result = await ArticleService.findAll();

            // Assert
            expect(result).toEqual(mockData);
            expect(ArticleRepository.findAll).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('should return article by ID', async () => {
            // Arrange
            const mockArticle = { _id: '123', title: 'Test Article' };
            ArticleRepository.findById.mockResolvedValue(mockArticle);

            // Act
            const result = await ArticleService.findById('123');

            // Assert
            expect(result).toEqual(mockArticle);
            expect(ArticleRepository.findById).toHaveBeenCalledWith('123');
        });
    });

    describe('create', () => {
        it('should create a new article', async () => {
            // Arrange
            const mockArticle = { title: 'New Article', content: 'Content here', category: '123' };
            ArticleRepository.create.mockResolvedValue(mockArticle);

            // Act
            const result = await ArticleService.create(mockArticle);

            // Assert
            expect(result).toEqual(mockArticle);
            expect(ArticleRepository.create).toHaveBeenCalledWith(mockArticle);
        });
    });

    describe('update', () => {
        it('should update an article by ID', async () => {
            // Arrange
            const mockArticle = { _id: '123', title: 'Updated Article' };
            ArticleRepository.update.mockResolvedValue(mockArticle);

            // Act
            const result = await ArticleService.update('123', { title: 'Updated Article' });

            // Assert
            expect(result).toEqual(mockArticle);
            expect(ArticleRepository.update).toHaveBeenCalledWith('123', {
                title: 'Updated Article',
            });
        });
    });

    describe('delete', () => {
        it('should delete an article by ID', async () => {
            // Arrange
            ArticleRepository.delete.mockResolvedValue(true);

            // Act
            const result = await ArticleService.delete('123');

            // Assert
            expect(result).toBe(true);
            expect(ArticleRepository.delete).toHaveBeenCalledWith('123');
        });
    });

    describe('searchAndPaginate', () => {
        it('should return paginated articles with keyword and category', async () => {
            // Arrange
            const mockData = {
                data: [{ title: 'Test Article' }],
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            };
            ArticleRepository.searchAndPaginate.mockResolvedValue(mockData);

            // Act
            const result = await ArticleService.searchAndPaginate({
                keyword: 'Test',
                category: 'Tech',
                page: 1,
                limit: 10,
            });

            // Assert
            expect(result).toEqual(mockData);
            expect(ArticleRepository.searchAndPaginate).toHaveBeenCalledWith({
                keyword: 'Test',
                category: 'Tech',
                page: 1,
                limit: 10,
            });
        });
    });

    describe('getCategoryIdByName', () => {
        it('should return category ID by name', async () => {
            // Arrange
            const mockCategory = { _id: '123', name: 'Tech' };
            CategoryRepository.findOneByName.mockResolvedValue(mockCategory);

            // Act
            const result = await ArticleService.getCategoryIdByName('Tech');

            // Assert
            expect(result).toEqual(mockCategory);
            expect(CategoryRepository.findOneByName).toHaveBeenCalledWith('Tech');
        });
    });

    describe('getAuthorIdByArticle', () => {
        it('should return author ID by article ID', async () => {
            // Arrange
            const mockAuthorId = 'author123';
            ArticleRepository.getAuthorIdByArticle.mockResolvedValue(mockAuthorId);

            // Act
            const result = await ArticleService.getAuthorIdByArticle('article123');

            // Assert
            expect(result).toBe(mockAuthorId);
            expect(ArticleRepository.getAuthorIdByArticle).toHaveBeenCalledWith('article123');
        });
    });

    describe('deleteWithTx', () => {
        let mockSession;

        beforeEach(() => {
            mockSession = {
                startTransaction: jest.fn(),
                commitTransaction: jest.fn().mockResolvedValue(),
                abortTransaction: jest.fn().mockResolvedValue(),
                endSession: jest.fn(),
            };
            conn.startSession = jest.fn().mockResolvedValue(mockSession);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should delete article and remove postedArticle from author in a transaction', async () => {
            // Arrange
            ArticleRepository.delete.mockResolvedValue(true);
            UserRepository.removePostedArticleFromAuthor.mockResolvedValue(true);

            // Act
            const articleId = 'article123';
            const authorId = 'author456';

            const result = await ArticleService.deleteWithTx(articleId, authorId);

            // Assert
            expect(conn.startSession).toHaveBeenCalled();
            expect(mockSession.startTransaction).toHaveBeenCalled();
            expect(ArticleRepository.delete).toHaveBeenCalledWith(articleId, {
                session: mockSession,
            });
            expect(UserRepository.removePostedArticleFromAuthor).toHaveBeenCalledWith(
                authorId,
                articleId,
                { session: mockSession }
            );
            expect(mockSession.commitTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('should abort transaction and throw error if any operation fails', async () => {
            ArticleRepository.delete.mockResolvedValue(true);
            UserRepository.removePostedArticleFromAuthor.mockRejectedValue(new Error('fail'));

            const articleId = 'article123';
            const authorId = 'author456';

            await expect(ArticleService.deleteWithTx(articleId, authorId)).rejects.toThrow(
                'Transaction failed: fail'
            );
            expect(mockSession.abortTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
        });
    });

    describe('createWithTx', () => {
        let mockSession;

        beforeEach(() => {
            mockSession = {
                startTransaction: jest.fn(),
                commitTransaction: jest.fn().mockResolvedValue(),
                abortTransaction: jest.fn().mockResolvedValue(),
                endSession: jest.fn(),
            };
            conn.startSession = jest.fn().mockResolvedValue(mockSession);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should create article and add postedArticle to author in a transaction', async () => {
            // Arrange
            const mockArticle = { _id: 'article123', title: 'New Article' };
            ArticleRepository.create.mockResolvedValue(mockArticle);
            UserRepository.addPostedArticleToAuthor.mockResolvedValue(true);

            // Act
            const articleData = { title: 'New Article', content: 'Content here', category: '123' };
            const authorId = 'author456';

            const result = await ArticleService.createWithTx(articleData, authorId);

            // Assert
            expect(conn.startSession).toHaveBeenCalled();
            expect(mockSession.startTransaction).toHaveBeenCalled();
            expect(ArticleRepository.create).toHaveBeenCalledWith(articleData, {
                session: mockSession,
            });
            expect(UserRepository.addPostedArticleToAuthor).toHaveBeenCalledWith(
                authorId,
                mockArticle._id,
                { session: mockSession }
            );
            expect(mockSession.commitTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
            expect(result).toEqual(mockArticle);
        });

        it('should abort transaction and throw error if any operation fails', async () => {
            ArticleRepository.create.mockResolvedValue({ _id: 'article123' });
            UserRepository.addPostedArticleToAuthor.mockRejectedValue(new Error('fail'));

            const articleData = { title: 'New Article', content: 'Content here', category: '123' };
            const authorId = 'author456';

            await expect(ArticleService.createWithTx(articleData, authorId)).rejects.toThrow(
                'Transaction failed: fail'
            );
            expect(mockSession.abortTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
        });
    });
});

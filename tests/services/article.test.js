const ArticleService = require('../../src/services/article');
const ArticleRepository = require('../../src/repositories/article');
const CategoryRepository = require('../../src/repositories/category');
const UserRepository = require('../../src/repositories/user');

jest.mock('../../src/repositories/article');
jest.mock('../../src/repositories/category');
jest.mock('../../src/repositories/user');

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

    describe('addPostedArticleToAuthor', () => {
        it("should add article ID to author's posted articles", async () => {
            // Arrange
            const authorId = 'author123';
            const articleId = 'article123';
            UserRepository.addPostedArticleToAuthor.mockResolvedValue(true);

            // Act
            const result = await ArticleService.addPostedArticleToAuthor(authorId, articleId);

            // Assert
            expect(result).toBe(true);
            expect(UserRepository.addPostedArticleToAuthor).toHaveBeenCalledWith(
                authorId,
                articleId
            );
        });
    });

    describe('removePostedArticleFromAuthor', () => {
        it("should remove article ID from author's posted articles", async () => {
            // Arrange
            const authorId = 'author123';
            const articleId = 'article123';
            UserRepository.removePostedArticleFromAuthor.mockResolvedValue(true);

            // Act
            const result = await ArticleService.removePostedArticleFromAuthor(authorId, articleId);

            // Assert
            expect(result).toBe(true);
            expect(UserRepository.removePostedArticleFromAuthor).toHaveBeenCalledWith(
                authorId,
                articleId
            );
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
});

const CommentRepository = require('../../../src/repositories/comment');
const CommentModel = require('../../../src/models/comment');

jest.mock('../../../src/models/comment');

describe('CommentRepository', () => {
    describe('findAll', () => {
        it('should return all comments', async () => {
            // Arrange
            const mockComments = [
                { content: 'Great article!', article: 'article1', user: 'user1' },
                { content: 'Very informative.', article: 'article2', user: 'user2' },
            ];
            const populateMock = jest.fn();
            populateMock
                .mockReturnValueOnce({ populate: populateMock })
                .mockReturnValueOnce(mockComments);

            CommentModel.find.mockReturnValue({ populate: populateMock });

            // Act
            const result = await CommentRepository.findAll();

            // Assert
            expect(CommentModel.find).toHaveBeenCalledWith({});
            expect(result).toEqual(mockComments);
        });
    });

    describe('findById', () => {
        it('should find a comment by ID', async () => {
            // Arrange
            const mockComment = {
                _id: '123',
                content: 'Nice post!',
                article: 'article1',
                user: 'user1',
            };
            const populateMock = jest.fn();
            populateMock
                .mockReturnValueOnce({ populate: populateMock })
                .mockReturnValueOnce(mockComment);
            CommentModel.findById.mockReturnValue({ populate: populateMock });

            // Act
            const result = await CommentRepository.findById('123');

            // Assert
            expect(CommentModel.findById).toHaveBeenCalledWith('123');
            expect(result).toEqual(mockComment);
        });
    });
});

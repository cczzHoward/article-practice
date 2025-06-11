const UserRepository = require('../../src/repositories/user');
const UserModel = require('../../src/models/user');

jest.mock('../../src/models/user');

describe('UserRepository', () => {
    describe('findAll', () => {
        it('should return all users', async () => {
            // Arrange
            const mockUsers = [{ username: 'user1' }, { username: 'user2' }];
            UserModel.find.mockResolvedValue(mockUsers);

            // Act
            const result = await UserRepository.findAll();

            // Assert
            expect(UserModel.find).toHaveBeenCalledWith({});
            expect(result).toEqual(mockUsers);
        });
    });

    describe('findById', () => {
        it('should find a user by ID', async () => {
            // Arrange
            const mockUser = { _id: '123', username: 'testuser' };
            UserModel.findById.mockResolvedValue(mockUser);

            // Act
            const result = await UserRepository.findById('123');

            // Assert
            expect(UserModel.findById).toHaveBeenCalledWith('123');
            expect(result).toEqual(mockUser);
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            // Arrange
            const mockUser = { username: 'newuser' };
            const saveMock = jest.fn().mockResolvedValue(mockUser);
            UserModel.mockImplementation(() => ({
                save: saveMock,
            }));

            // Act
            const result = await UserRepository.create(mockUser);

            // Assert
            expect(UserModel).toHaveBeenCalledWith(mockUser);
            expect(saveMock).toHaveBeenCalled();
            expect(result).toEqual(mockUser);
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            // Arrange
            const mockUser = { _id: '123', username: 'updateduser' };
            const updateData = { username: 'updateduser' };
            UserModel.findByIdAndUpdate.mockResolvedValue(mockUser);

            // Act
            const result = await UserRepository.update('123', updateData);

            // Assert
            expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith('123', updateData, {
                new: true,
            });
            expect(result).toEqual(mockUser);
        });
    });

    describe('delete', () => {
        it('should delete a user', async () => {
            // Arrange
            const mockUser = { _id: '123', username: 'deleteduser' };
            UserModel.findByIdAndDelete.mockResolvedValue(mockUser);

            // Act
            const result = await UserRepository.delete('123');

            // Assert
            expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith('123', {});
            expect(result).toEqual(mockUser);
        });
    });

    describe('findByUsername', () => {
        it('should find a user by username', async () => {
            // Arrange
            const mockUser = { username: 'testuser' };
            UserModel.findOne.mockResolvedValue(mockUser);

            // Act
            const result = await UserRepository.findByUsername('testuser');

            // Assert
            expect(UserModel.findOne).toHaveBeenCalledWith({ username: 'testuser' });
            expect(result).toEqual(mockUser);
        });
    });

    describe('addPostedArticleToAuthor', () => {
        it("should add an article to the author's posted articles", async () => {
            // Arrange
            const mockUser = { _id: 'authorId', postedArticles: [] };
            UserModel.findByIdAndUpdate.mockResolvedValue(mockUser);

            // Act
            const result = await UserRepository.addPostedArticleToAuthor('authorId', 'articleId');

            // Assert
            expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                'authorId',
                { $addToSet: { postedArticles: 'articleId' } },
                { new: true }
            );
            expect(result).toEqual(mockUser);
        });
    });

    describe('removePostedArticleFromAuthor', () => {
        it("should remove an article from the author's posted articles", async () => {
            // Arrange
            const mockUser = { _id: 'authorId', postedArticles: ['articleId'] };
            UserModel.findByIdAndUpdate.mockResolvedValue(mockUser);

            // Act
            const result = await UserRepository.removePostedArticleFromAuthor(
                'authorId',
                'articleId'
            );

            // Assert
            expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                'authorId',
                { $pull: { postedArticles: 'articleId' } },
                { new: true }
            );
            expect(result).toEqual(mockUser);
        });
    });
});

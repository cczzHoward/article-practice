const UserService = require('../../../src/services/user');
const UserRepository = require('../../../src/repositories/user');

jest.mock('../../../src/repositories/user');

describe('UserService', () => {
    describe('findAll', () => {
        it('should return all users', async () => {
            // Arrange
            const mockUsers = [{ username: 'user1' }, { username: 'user2' }];
            UserRepository.findAll.mockResolvedValue(mockUsers);

            // Act
            const result = await UserService.findAll();

            // Assert
            expect(result).toEqual(mockUsers);
            expect(UserRepository.findAll).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('should return user by ID', async () => {
            // Arrange
            const mockUser = { _id: '123', username: 'testuser' };
            UserRepository.findById.mockResolvedValue(mockUser);

            // Act
            const result = await UserService.findById('123');

            // Assert
            expect(result).toEqual(mockUser);
            expect(UserRepository.findById).toHaveBeenCalledWith('123');
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            // Arrange
            const mockUser = { username: 'newuser', password: 'password123' };
            UserRepository.create.mockResolvedValue(mockUser);

            // Act
            const result = await UserService.create(mockUser);

            // Assert
            expect(result).toEqual(mockUser);
            expect(UserRepository.create).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('update', () => {
        it('should update a user by ID', async () => {
            // Arrange
            const userId = '123';
            const updateData = { username: 'updateduser' };
            const mockUser = { _id: userId, ...updateData };
            UserRepository.update.mockResolvedValue(mockUser);

            // Act
            const result = await UserService.update(userId, updateData);

            // Assert
            expect(result).toEqual(mockUser);
            expect(UserRepository.update).toHaveBeenCalledWith(userId, updateData);
        });
    });

    describe('delete', () => {
        it('should delete a user by ID', async () => {
            // Arrange
            const userId = '123';
            UserRepository.delete.mockResolvedValue({ acknowledged: true });

            // Act
            const result = await UserService.delete(userId);

            // Assert
            expect(result).toEqual({ acknowledged: true });
            expect(UserRepository.delete).toHaveBeenCalledWith(userId);
        });
    });
});

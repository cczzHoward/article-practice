const AuthService = require('../../src/services/auth');
const UserRepository = require('../../src/repositories/user');

jest.mock('../../src/repositories/user');

describe('AuthService', () => {
    describe('findAll', () => {
        it('should return all users', async () => {
            // Arrange
            const mockUsers = [{ username: 'user1' }, { username: 'user2' }];
            UserRepository.findAll.mockResolvedValue(mockUsers);

            // Act
            const result = await AuthService.findAll();

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
            const result = await AuthService.findById('123');

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
            const result = await AuthService.create(mockUser);

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
            const result = await AuthService.update(userId, updateData);

            // Assert
            expect(result).toEqual(mockUser);
            expect(UserRepository.update).toHaveBeenCalledWith(userId, updateData);
        });
    });

    describe('delete', () => {
        it('should delete a user by ID', async () => {
            // Arrange
            const userId = '123';
            UserRepository.delete.mockResolvedValue(true);

            // Act
            const result = await AuthService.delete(userId);

            // Assert
            expect(result).toEqual(true);
            expect(UserRepository.delete).toHaveBeenCalledWith(userId);
        });
    });

    describe('register', () => {
        it('should register a new user', async () => {
            // Arrange
            const username = 'testuser';
            const password = 'password123';
            const mockUser = { _id: '123', username, password };

            UserRepository.findByUsername.mockResolvedValue(null);
            UserRepository.create.mockResolvedValue(mockUser);

            // Act
            const result = await AuthService.register(username, password);

            // Assert
            expect(result).toEqual(mockUser);
            expect(UserRepository.findByUsername).toHaveBeenCalledWith(username);
            expect(UserRepository.create).toHaveBeenCalledWith({ username, password });
        });
    });

    describe('login', () => {
        it('should login a user and return a JWT token', async () => {
            // Arrange
            const username = 'testuser';
            const password = 'password123';
            const mockUser = { _id: '123', username, role: 'user', comparePassword: jest.fn() };
            const jwtToken = 'mock.jwt.token';

            UserRepository.findByUsername.mockResolvedValue(mockUser);
            mockUser.comparePassword.mockResolvedValue(true);
            jest.spyOn(require('jsonwebtoken'), 'sign').mockReturnValue(jwtToken);

            // Act
            const result = await AuthService.login(username, password);

            // Assert
            expect(result).toBe(jwtToken);
            expect(UserRepository.findByUsername).toHaveBeenCalledWith(username);
            expect(mockUser.comparePassword).toHaveBeenCalledWith(password);
        });

        it('should throw an error if user not found', async () => {
            // Arrange
            const username = 'nonexistent';
            const password = 'password123';

            UserRepository.findByUsername.mockResolvedValue(null);

            // Act & Assert
            await expect(AuthService.login(username, password)).rejects.toThrow('User not found');
            expect(UserRepository.findByUsername).toHaveBeenCalledWith(username);
        });

        it('should throw an error if password is invalid', async () => {
            // Arrange
            const username = 'testuser';
            const password = 'wrongpassword';
            const mockUser = { _id: '123', username, comparePassword: jest.fn() };

            UserRepository.findByUsername.mockResolvedValue(mockUser);
            mockUser.comparePassword.mockResolvedValue(false);

            // Act & Assert
            await expect(AuthService.login(username, password)).rejects.toThrow('Invalid password');
            expect(UserRepository.findByUsername).toHaveBeenCalledWith(username);
            expect(mockUser.comparePassword).toHaveBeenCalledWith(password);
        });
    });

    describe('changePassword', () => {
        it('should change user password', async () => {
            // Arrange
            const userId = '123';
            const oldPassword = 'oldpassword';
            const newPassword = 'newpassword';
            const mockUser = { _id: userId, comparePassword: jest.fn(), save: jest.fn() };

            UserRepository.findById.mockResolvedValue(mockUser);
            mockUser.comparePassword.mockResolvedValue(true);

            // Act
            const result = await AuthService.changePassword(userId, oldPassword, newPassword);

            // Assert
            expect(result).toEqual(mockUser);
            expect(UserRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockUser.comparePassword).toHaveBeenCalledWith(oldPassword);
            expect(mockUser.save).toHaveBeenCalled();
        });

        it('should throw an error if user not found', async () => {
            // Arrange
            const userId = 'nonexistent';
            const oldPassword = 'oldpassword';
            const newPassword = 'newpassword';

            UserRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(
                AuthService.changePassword(userId, oldPassword, newPassword)
            ).rejects.toThrow('User not found');
            expect(UserRepository.findById).toHaveBeenCalledWith(userId);
        });

        it('should throw an error if old password is invalid', async () => {
            // Arrange
            const userId = '123';
            const oldPassword = 'wrongoldpassword';
            const newPassword = 'newpassword';
            const mockUser = { _id: userId, comparePassword: jest.fn() };

            UserRepository.findById.mockResolvedValue(mockUser);
            mockUser.comparePassword.mockResolvedValue(false);

            // Act & Assert
            await expect(
                AuthService.changePassword(userId, oldPassword, newPassword)
            ).rejects.toThrow('Invalid old password');
            expect(UserRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockUser.comparePassword).toHaveBeenCalledWith(oldPassword);
        });

        it('should throw an error if new password is the same as old password', async () => {
            // Arrange
            const userId = '123';
            const oldPassword = 'samepassword';
            const newPassword = 'samepassword';
            const mockUser = { _id: userId, comparePassword: jest.fn() };

            UserRepository.findById.mockResolvedValue(mockUser);
            mockUser.comparePassword.mockResolvedValue(true);

            // Act & Assert
            await expect(
                AuthService.changePassword(userId, oldPassword, newPassword)
            ).rejects.toThrow('New password cannot be the same as old password');
            expect(UserRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockUser.comparePassword).toHaveBeenCalledWith(oldPassword);
        });
    });
});

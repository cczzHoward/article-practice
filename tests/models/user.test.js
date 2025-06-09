const bcrypt = require('bcrypt');
const UserModel = require('../../src/models/user');

jest.mock('bcrypt');

describe('UserModel', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('comparePassword', () => {
        it('should return true if password matches', async () => {
            const user = new UserModel({ username: 'test', password: 'hashed' });
            bcrypt.compare.mockResolvedValue(true);

            const result = await user.comparePassword('plain');
            expect(bcrypt.compare).toHaveBeenCalledWith('plain', 'hashed');
            expect(result).toBe(true);
        });

        it('should return false if password does not match', async () => {
            const user = new UserModel({ username: 'test', password: 'hashed' });
            bcrypt.compare.mockResolvedValue(false);

            const result = await user.comparePassword('wrong');
            expect(bcrypt.compare).toHaveBeenCalledWith('wrong', 'hashed');
            expect(result).toBe(false);
        });

        it('should throw error if bcrypt fails', async () => {
            const user = new UserModel({ username: 'test', password: 'hashed' });
            bcrypt.compare.mockRejectedValue(new Error('bcrypt error'));

            await expect(user.comparePassword('plain')).rejects.toThrow('Error comparing password');
        });
    });
});

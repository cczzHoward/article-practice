const {
    registerSchema,
    loginSchema,
    changePasswordSchema,
} = require('../../../src/validators/auth');

describe('Auth Validators', () => {
    describe('registerSchema', () => {
        it('should pass with valid data', () => {
            const data = {
                username: 'testuser',
                password: 'Test@1234',
            };
            const { error, value } = registerSchema.validate(data);
            expect(error).toBeUndefined();
            expect(value).toEqual(data);
        });

        it('should fail if username is missing', () => {
            const data = { password: 'Test@1234' };
            const { error } = registerSchema.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/"username" is required/);
        });

        it('should fail if password is too short', () => {
            const data = { username: 'testuser', password: 'short' };
            const { error } = registerSchema.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(
                /"password" length must be at least 8 characters long/
            );
        });
    });

    describe('loginSchema', () => {
        it('should pass with valid data', () => {
            const data = {
                username: 'testuser',
                password: 'Test@1234',
            };
            const { error, value } = loginSchema.validate(data);
            expect(error).toBeUndefined();
            expect(value).toEqual(data);
        });

        it('should fail if username is missing', () => {
            const data = { password: 'Test@1234' };
            const { error } = loginSchema.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/"username" is required/);
        });

        it('should fail if password is too short', () => {
            const data = { username: 'testuser', password: 'short' };
            const { error } = loginSchema.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(
                /"password" length must be at least 8 characters long/
            );
        });
    });

    describe('changePasswordSchema', () => {
        it('should pass with valid data', () => {
            const data = {
                oldPassword: 'Old@1234',
                newPassword: 'New@1234',
            };
            const { error, value } = changePasswordSchema.validate(data);
            expect(error).toBeUndefined();
            expect(value).toEqual(data);
        });

        it('should fail if oldPassword is missing', () => {
            const data = { newPassword: 'New@1234' };
            const { error } = changePasswordSchema.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/"oldPassword" is required/);
        });

        it('should fail if newPassword is too short', () => {
            const data = { oldPassword: 'Old@1234', newPassword: 'short' };
            const { error } = changePasswordSchema.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(
                /"newPassword" length must be at least 8 characters long/
            );
        });
    });
});

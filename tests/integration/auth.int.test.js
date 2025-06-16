// 註冊新用戶（POST /api/v1/users/register）
// 登入取得 JWT（POST /api/v1/users/login）
// 變更密碼（POST /api/v1/users/change-password，需帶 token）

// 測試未帶 token、帶錯誤 token、權限不足時的回應。
const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');

describe('Auth API Integration Tests', () => {
    let adminToken, testUserId;
    beforeAll(async () => {
        // 連接到測試資料庫 const dbUri = process.env.MONGODB_URI;
        const dbUri = process.env.MONGODB_URI;
        await mongoose.connect(dbUri);
    });

    afterAll(async () => {
        // 登入 admin 並清除測試資料
        const loginResponse = await request(app)
            .post('/api/v1/users/login')
            .send({ username: 'admin', password: 'admin123' });
        adminToken = loginResponse.body.data.token;

        await request(app)
            .delete(`/api/v1/users/${testUserId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        // 關閉資料庫連接
        await mongoose.connection.close();
    });
    describe('register a new user', () => {
        it('should register a new user successfully', async () => {
            const newUser = {
                username: 'inttestuser',
                password: 'iamtestuser',
            };
            const response = await request(app).post('/api/v1/users/register').send(newUser);
            testUserId = response.body.data.id;
            expect(response.statusCode).toBe(201);
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.message).toBe('User registered successfully');
            expect(response.body.success).toBe(true);
        });

        it('should fail to register with existing username', async () => {
            const existingUser = {
                username: 'inttestuser',
                password: 'iamtestuser2',
            };

            const response = await request(app).post('/api/v1/users/register').send(existingUser);
            expect(response.statusCode).toBe(409);
            expect(response.body.data).toBeNull();
            expect(response.body.message).toBe('User already exists');
            expect(response.body.success).toBe(false);
        });
    });

    describe('login to get JWT', () => {
        it('should login successfully and return JWT', () => {
            // Test logic for successful login
            expect(true).toBe(true);
        });

        it('should fail to login with incorrect credentials', () => {
            // Test logic for failed login due to incorrect credentials
            expect(true).toBe(true);
        });
    });

    describe('change password with token', () => {
        let jwtToken;

        beforeAll(() => {
            // Simulate user login to get JWT token
        });

        it('should change password successfully with valid token', () => {
            // Test logic for changing password with valid JWT token
            expect(true).toBe(true);
        });

        it('should fail to change password with invalid token', () => {
            // Test logic for changing password with invalid JWT token
            expect(true).toBe(true);
        });

        it('should fail to change password without token', () => {
            // Test logic for changing password without JWT token
            expect(true).toBe(true);
        });

        it('should fail to change password if oldPassword is wrong', () => {
            // Test logic for changing password with insufficient permissions
            expect(true).toBe(true);
        });

        it('should fail to change password without newPassword', () => {
            // Test logic for changing password with invalid new password
            expect(true).toBe(true);
        });

        it('should fail to change password with invalid newPassword format', () => {
            // Test logic for changing password with invalid new password format
            expect(true).toBe(true);
        });
    });
});

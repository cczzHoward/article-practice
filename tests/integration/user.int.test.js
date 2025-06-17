const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');

// 因為目前沒有新增管理員的方式，所以直接引入 model 做操作
const UserModel = require('../../src/models/user');

describe('User API Integration Tests', () => {
    beforeAll(async () => {
        // 連接到測試資料庫
        const dbUri = process.env.MONGODB_URI;
        await mongoose.connect(dbUri);
    });

    afterAll(async () => {
        // 關閉資料庫連接
        await mongoose.connection.close();
    });

    describe('delete a user', () => {
        let testAdminToken, testAdminId;
        let testUserId, testUserToken;

        beforeEach(async () => {
            // 新增測試用使用者並取得 userToken
            const newUser = {
                username: 'testuser',
                password: 'testpassword',
            };

            const newUserResponse = await request(app).post('/api/v1/users/register').send(newUser);
            testUserId = newUserResponse.body.data.id;

            const newUserloginResponse = await request(app)
                .post('/api/v1/users/login')
                .send(newUser);
            testUserToken = newUserloginResponse.body.data.token;

            // 新增測試用管理員並與取得 adminToken
            const newAdmin = new UserModel({
                username: 'testadmin',
                password: 'testadminpassword',
                role: 'admin',
            });
            await newAdmin.save();
            testAdminId = newAdmin._id;

            const newAdminloginResponse = await request(app)
                .post('/api/v1/users/login')
                .send({ username: 'testadmin', password: 'testadminpassword' });
            testAdminToken = newAdminloginResponse.body.data.token;
        });

        afterEach(async () => {
            // 清除測試用使用者
            await request(app)
                .delete(`/api/v1/users/${testUserId}`)
                .set('Authorization', `Bearer ${testAdminToken}`);

            // 清除測試用管理員
            await UserModel.deleteOne({ username: 'testadmin' });
        });

        it('should allow admin to delete another user', async () => {
            const response = await request(app)
                .delete(`/api/v1/users/${testUserId}`)
                .set('Authorization', `Bearer ${testAdminToken}`);

            expect(response.statusCode).toBe(204);
        });

        it('should allow user to delete its own account', async () => {
            const response = await request(app)
                .delete(`/api/v1/users/${testUserId}`)
                .set('Authorization', `Bearer ${testUserToken}`);

            expect(response.statusCode).toBe(204);
        });

        it('should return 403 if admin tries to delete its own account', async () => {
            const response = await request(app)
                .delete(`/api/v1/users/${testAdminId}`)
                .set('Authorization', `Bearer ${testAdminToken}`);

            expect(response.statusCode).toBe(403);
            expect(response.body.data).toBeNull();
            expect(response.body.message).toBe('You do not have permission to delete this user');
            expect(response.body.success).toBe(false);
        });

        it('should return 404 if user does not exist', async () => {
            const nonExistentUserId = '60c72b2f9b1e8d001c8e4f5a';
            const response = await request(app)
                .delete(`/api/v1/users/${nonExistentUserId}`)
                .set('Authorization', `Bearer ${testAdminToken}`);

            expect(response.statusCode).toBe(404);
            expect(response.body.data).toBeNull();
            expect(response.body.message).toBe('User not found');
            expect(response.body.success).toBe(false);
        });

        it('should return 403 if user tries to delete another user', async () => {
            const response = await request(app)
                .delete(`/api/v1/users/${testAdminId}`)
                .set('Authorization', `Bearer ${testUserToken}`);

            expect(response.statusCode).toBe(403);
            expect(response.body.data).toBeNull();
            expect(response.body.message).toBe('You do not have permission to delete this user');
            expect(response.body.success).toBe(false);
        });

        it('should return 401 if user is not authenticated', async () => {
            const response = await request(app).delete(`/api/v1/users/${testUserId}`);
            expect(response.statusCode).toBe(401);
        });

        it('should return 400 if user ID is invalid', async () => {
            const invalidUserId = 'invalidUserId';
            const response = await request(app)
                .delete(`/api/v1/users/${invalidUserId}`)
                .set('Authorization', `Bearer ${testAdminToken}`);

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('Validation failed');
            expect(response.body.success).toBe(false);
        });
    });
});

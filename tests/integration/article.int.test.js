// 新增文章（POST /api/v1/articles/，需登入）
// 查詢文章列表（GET /api/v1/articles/list，公開）
// 查詢單篇文章（GET /api/v1/articles/:id，公開）
// 編輯文章（PATCH /api/v1/articles/:id，需作者或 admin）
// 刪除文章（DELETE /api/v1/articles/:id，需作者或 admin）

const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');

describe('Article API Integration Tests', () => {
    let adminToken, userToken;
    let adminArticleId, userArticleId;

    beforeAll(async () => {
        // 連接到測試資料庫 const dbUri = process.env.MONGODB_URI;
        const dbUri = process.env.MONGODB_URI;
        await mongoose.connect(dbUri);

        // 登入 admin 取得 token
        const loginResponse = await request(app)
            .post('/api/v1/users/login')
            .send({ username: 'admin', password: 'admin123' });
        adminToken = loginResponse.body.data.token;

        // 登入一般用戶取得 token
        const userLoginResponse = await request(app)
            .post('/api/v1/users/login')
            .send({ username: 'test1234', password: 'test1234' });
        userToken = userLoginResponse.body.data.token;

        // 創建一篇 admin 的文章以供測試
        const adminArticleResponse = await request(app)
            .post('/api/v1/articles/')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: 'Admin Test Article',
                content: 'This is a test article created by admin.',
                category: '其他',
            });
        adminArticleId = adminArticleResponse.body.data.id;

        // 創立一篇一般用戶的文章以供測試
        const userArticleResponse = await request(app)
            .post('/api/v1/articles/')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                title: 'User Test Article',
                content: 'This is a test article created by user.',
                category: '其他',
            });
        userArticleId = userArticleResponse.body.data.id;
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('get article list', () => {
        it('should get the article list', async () => {
            const response = await request(app).get('/api/v1/articles/list');

            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data.data)).toBe(true);
        });
    });

    describe('get a single article', () => {
        it('should get a single article by ID', async () => {
            const response = await request(app).get(`/api/v1/articles/${adminArticleId}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('success');
        });
    });

    describe('create a new article', () => {
        let createdArticleId;
        it('user should not create an article without token', async () => {
            const newArticle = {
                title: 'Unauthorized Article',
                content: 'This article should not be created without token.',
                category: '其他',
            };

            const response = await request(app).post('/api/v1/articles/').send(newArticle);

            expect(response.statusCode).toBe(401);
            expect(response.text).toBe('Unauthorized');
        });

        it('user should not create an article with wrong body', async () => {
            const newArticle = {
                title: 'Invalid Article',
                category: '其他',
                somethingElse: 'This should not be here',
            };

            const response = await request(app)
                .post('/api/v1/articles/')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newArticle);

            expect(response.statusCode).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should create a new article', async () => {
            const newArticle = {
                title: 'Test Article',
                content: 'This is a test article content.',
                category: '其他',
            };

            const response = await request(app)
                .post('/api/v1/articles/')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newArticle);
            createdArticleId = response.body.data.id;

            expect(response.statusCode).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('article created successfully');
        });

        afterAll(async () => {
            // 清理測試資料庫中的文章
            await request(app)
                .delete(`/api/v1/articles/${createdArticleId}`)
                .set('Authorization', `Bearer ${adminToken}`);
        });
    });

    describe('update an article', () => {
        it('user should not update an article without token', async () => {
            const updatedArticle = {
                title: 'Unauthorized Update',
                content: 'This update should not be allowed.',
            };

            const response = await request(app)
                .patch(`/api/v1/articles/${adminArticleId}`)
                .send(updatedArticle);

            expect(response.statusCode).toBe(401);
            expect(response.text).toBe('Unauthorized');
        });

        it('user should not update an article with wrong body', async () => {
            const updatedArticle = {
                title: 'Invalid Update',
                content: 'This update should not be allowed.',
                extraField: 'This should not be here',
            };

            const response = await request(app)
                .patch(`/api/v1/articles/${adminArticleId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updatedArticle);

            expect(response.statusCode).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
        });

        it("user should not update another user's article", async () => {
            const updatedArticle = {
                title: 'Unauthorized Update',
                content: 'This update should not be allowed.',
            };

            const response = await request(app)
                .patch(`/api/v1/articles/${adminArticleId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(updatedArticle);

            expect(response.statusCode).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(
                'You do not have permission to access this resource'
            );
        });

        it('admin should update its own article', async () => {
            const updatedArticle = {
                title: 'Updated Test Article',
                content: 'This is an updated test article content.',
            };

            const response = await request(app)
                .patch(`/api/v1/articles/${adminArticleId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updatedArticle);

            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('article updated successfully');
        });

        it("admin should update user's article", async () => {
            const updatedArticle = {
                title: 'Updated User Test Article',
                content: 'This is an updated test article content by admin.',
            };

            const response = await request(app)
                .patch(`/api/v1/articles/${userArticleId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updatedArticle);
            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('article updated successfully');
        });

        it('user should update its own article', async () => {
            const updatedArticle = {
                title: 'Updated User Test Article',
                content: 'This is an updated test article content by user.',
            };

            const response = await request(app)
                .patch(`/api/v1/articles/${userArticleId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(updatedArticle);

            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('article updated successfully');
        });
    });

    describe('delete an article', () => {
        let tempUserArticleId;
        beforeAll(async () => {
            const userArticleResponse = await request(app)
                .post('/api/v1/articles/')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    title: 'User Test Article',
                    content: 'This is a test article created by user.',
                    category: '其他',
                });
            expect(userArticleResponse.statusCode).toBe(201);
            tempUserArticleId = userArticleResponse.body.data.id;
        });

        it('user should not delete an article without token', async () => {
            const response = await request(app).delete(`/api/v1/articles/${adminArticleId}`);

            expect(response.statusCode).toBe(401);
            expect(response.text).toBe('Unauthorized');
        });

        it('user should not delete an article with wrong ID', async () => {
            const response = await request(app)
                .delete('/api/v1/articles/invalidArticleId')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
        });

        it("user should not delete another user's article", async () => {
            const response = await request(app)
                .delete(`/api/v1/articles/${adminArticleId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(
                'You do not have permission to access this resource'
            );
        });

        it('user should delete its own article', async () => {
            const response = await request(app)
                .delete(`/api/v1/articles/${userArticleId}`)
                .set('Authorization', `Bearer ${userToken}`);

            // expect(response.statusCode).toBe(204);
            expect(response.body).toEqual({});
            expect(response.body.success).toBeUndefined();
        });

        it('admin should delete its own article', async () => {
            const response = await request(app)
                .delete(`/api/v1/articles/${adminArticleId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.statusCode).toBe(204);
            expect(response.body).toEqual({});
            expect(response.body.success).toBeUndefined();
        });

        it("admin should delete user's article", async () => {
            const response = await request(app)
                .delete(`/api/v1/articles/${tempUserArticleId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.statusCode).toBe(204);
            expect(response.body).toEqual({});
            expect(response.body.success).toBeUndefined();
        });
    });
});

const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');
const category = require('../../src/repositories/category');

describe('Comment API Integration Tests', () => {
    let userToken, testArticleId;
    beforeAll(async () => {
        const dbUri = process.env.MONGODB_URI;
        await mongoose.connect(dbUri);

        // 取得測試用戶的token
        const userLoginResponse = await request(app)
            .post('/api/v1/users/login')
            .send({ username: 'test1234', password: 'test1234' });
        userToken = userLoginResponse.body.data.token;

        // 創立測試文章
        const articleResponse = await request(app)
            .post('/api/v1/articles')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                title: 'Test Article',
                content: 'This is a test article for comment integration tests.',
                category: '其他',
            });
        testArticleId = articleResponse.body.data.id;
    });

    afterAll(async () => {
        // 刪除測試文章
        await request(app)
            .delete(`/api/v1/articles/${testArticleId}`)
            .set('Authorization', `Bearer ${userToken}`);

        await mongoose.disconnect();
    });

    describe('post comment', () => {
        it('should create a comment successfully', async () => {
            const response = await request(app)
                .post(`/api/v1/comments/${testArticleId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ content: 'This is a test comment.' });

            expect(response.status).toBe(201);
            expect(response.body.data).toBeDefined();
            expect(response.body.message).toBe('Comment created successfully');
            expect(response.body.success).toBe(true);
        });

        it('should return 404 for non-existent article', async () => {
            const nonExistentArticleId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .post(`/api/v1/comments/${nonExistentArticleId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ content: 'This comment is for a non-existent article.' });

            expect(response.status).toBe(404);
            expect(response.body.data).toBeNull();
            expect(response.body.message).toBe('Article not found');
            expect(response.body.success).toBe(false);
        });

        it('should return 401 for unauthenticated user', async () => {
            const response = await request(app)
                .post(`/api/v1/comments/${testArticleId}`)
                .send({ content: 'This is a comment without auth.' });

            expect(response.status).toBe(401);
            expect(response.text).toBe('Unauthorized');
        });

        it('should return 400 for invalid comment data', async () => {
            const response = await request(app)
                .post(`/api/v1/comments/${testArticleId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ content: '' }); // 空內容

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
            expect(response.body.success).toBe(false);
        });
    });
    describe('delete comment', () => {
        it('should delete a comment successfully', async () => {
            // 首先創建一個評論
            const createResponse = await request(app)
                .post(`/api/v1/comments/${testArticleId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ content: 'This is a comment to be deleted.' });

            const commentId = createResponse.body.data.id;

            // 然後刪除該評論
            const deleteResponse = await request(app)
                .delete(`/api/v1/comments/${commentId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(deleteResponse.status).toBe(204);
            expect(deleteResponse.body).toEqual({});
        });

        it('should return 404 for non-existent comment', async () => {
            const nonExistentCommentId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .delete(`/api/v1/comments/${nonExistentCommentId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(404);
            expect(response.body.data).toBeNull();
            expect(response.body.message).toBe('Comment not found');
            expect(response.body.success).toBe(false);
        });

        it('should return 403 for unauthorized user trying to delete comment', async () => {
            // 首先創建一個評論
            const createResponse = await request(app)
                .post(`/api/v1/comments/${testArticleId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ content: 'This is a comment to be deleted by another user.' });

            const commentId = createResponse.body.data.id;

            // 嘗試使用另一個用戶的token刪除評論
            const anotherUserLoginResponse = await request(app)
                .post('/api/v1/users/login')
                .send({ username: 'charlie', password: 'charlie123' });
            const anotherUserToken = anotherUserLoginResponse.body.data.token;

            const response = await request(app)
                .delete(`/api/v1/comments/${commentId}`)
                .set('Authorization', `Bearer ${anotherUserToken}`);

            expect(response.status).toBe(403);
            expect(response.body.data).toBeNull();
            expect(response.body.message).toBe('You do not have permission to delete this comment');
            expect(response.body.success).toBe(false);
        });

        it('should return 401 for unauthenticated user trying to delete comment', async () => {
            // 首先創建一個評論
            const createResponse = await request(app)
                .post(`/api/v1/comments/${testArticleId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ content: 'This is a comment to be deleted without auth.' });

            const commentId = createResponse.body.data.id;

            // 嘗試未經身份驗證的請求刪除評論
            const response = await request(app).delete(`/api/v1/comments/${commentId}`);

            expect(response.status).toBe(401);
            expect(response.text).toBe('Unauthorized');
        });

        it('should return 400 for invalid comment ID', async () => {
            const invalidCommentId = 'invalidObjectId';
            const response = await request(app)
                .delete(`/api/v1/comments/${invalidCommentId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
            expect(response.body.success).toBe(false);
        });
    });
});

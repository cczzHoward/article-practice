// 新增文章（POST /api/v1/articles/，需登入）
// 查詢文章列表（GET /api/v1/articles/list，公開）
// 查詢單篇文章（GET /api/v1/articles/:id，公開）
// 編輯文章（PATCH /api/v1/articles/:id，需作者或 admin）
// 刪除文章（DELETE /api/v1/articles/:id，需作者或 admin）

const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');

describe('Article API Integration Tests', () => {
    let token;
    let articleId;

    beforeAll(async () => {
        // 連接到測試資料庫 const dbUri = process.env.MONGODB_URI;
        const dbUri = process.env.MONGODB_URI;
        await mongoose.connect(dbUri);

        // 登入取得 token
        const loginResponse = await request(app)
            .post('/api/v1/users/login')
            .send({ username: 'admin', password: 'admin123' });
        expect(loginResponse.statusCode).toBe(200);
        token = loginResponse.body.data.token;
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('should get the article list', async () => {
        const response = await request(app).get('/api/v1/articles/list');

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data.data)).toBe(true);
    });

    it('should create a new article', async () => {
        const newArticle = {
            title: 'Test Article',
            content: 'This is a test article content.',
            category: '其他',
        };

        const response = await request(app)
            .post('/api/v1/articles/')
            .set('Authorization', `Bearer ${token}`)
            .send(newArticle);

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('article created successfully');

        articleId = response.body.data._id; // 保存新建文章的 ID
    });
});

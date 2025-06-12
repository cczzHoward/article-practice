// 新增分類（POST /api/v1/categories/，需 admin）
// 查詢分類列表（GET /api/v1/categories/，公開）
// 編輯分類（PATCH /api/v1/categories/:id，需 admin）
// 刪除分類（DELETE /api/v1/categories/:id，需 admin）

const request = require('supertest');
const app = require('../../src/app');

describe('test description', () => {
    it('should return 200 for root endpoint', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Root endpoint is working!');
    });
});

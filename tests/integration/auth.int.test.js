// 註冊新用戶（POST /api/v1/users/register）
// 登入取得 JWT（POST /api/v1/users/login）
// 變更密碼（POST /api/v1/users/change-password，需帶 token）
// 刪除用戶（DELETE /api/v1/users/:id，需權限驗證）

// 測試未帶 token、帶錯誤 token、權限不足時的回應。
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

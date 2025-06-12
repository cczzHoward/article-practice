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

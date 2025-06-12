const {
    getAllArticlesSchema,
    createArticleSchema,
    updateArticleSchema,
} = require('../../../src/validators/article');

describe('Article Validators', () => {
    describe('getAllArticlesSchema', () => {
        it('should pass with valid data', () => {
            const data = {
                keyword: 'test',
                category: '前端',
                page: 1,
                limit: 10,
            };
            const { error, value } = getAllArticlesSchema.validate(data);
            expect(error).toBeUndefined();
            expect(value).toEqual(data);
        });

        it('should pass with optional fields missing', () => {
            const data = {};
            const { error, value } = getAllArticlesSchema.validate(data);
            expect(error).toBeUndefined();
            expect(value).toEqual({ page: 1, limit: 10 });
        });

        it('should fail if category is invalid', () => {
            const data = {
                category: '不存在的分類',
            };
            const { error } = getAllArticlesSchema.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/category/);
        });

        it('should fail if page is less than 1', () => {
            const data = {
                page: 0,
            };
            const { error } = getAllArticlesSchema.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/page/);
        });

        it('should fail if limit is greater than 100', () => {
            const data = {
                limit: 101,
            };
            const { error } = getAllArticlesSchema.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/limit/);
        });
    });

    describe('createArticleSchema', () => {
        it('should pass with valid data', () => {
            const data = {
                title: 'Test Title',
                content: 'Test Content',
                category: '技術新知',
            };
            const { error, value } = createArticleSchema.validate(data);
            expect(error).toBeUndefined();
            expect(value).toEqual(data);
        });

        it('should fail if title is missing', () => {
            const data = {
                content: 'Test Content',
                category: '技術新知',
            };
            const { error } = createArticleSchema.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/title/);
        });

        it('should fail if category is invalid', () => {
            const data = {
                title: 'Test Title',
                content: 'Test Content',
                category: '不存在的分類',
            };
            const { error } = createArticleSchema.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/category/);
        });
    });

    describe('updateArticleSchema', () => {
        it('should pass with valid data', () => {
            const data = {
                title: 'Updated Title',
                content: 'Updated Content',
            };
            const { error, value } = updateArticleSchema.validate(data);
            expect(error).toBeUndefined();
            expect(value).toEqual(data);
        });

        it('should fail with empty object', () => {
            const data = {};
            const { error } = updateArticleSchema.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/at least one of/);
        });

        it('should fail if title is too long', () => {
            const data = {
                title: 'a'.repeat(129), // 129 characters
            };
            const { error } = updateArticleSchema.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/title/);
        });

        it('should fail if content is too long', () => {
            const data = {
                content: 'a'.repeat(25566), // 25566 characters
            };
            const { error } = updateArticleSchema.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/content/);
        });
    });
});

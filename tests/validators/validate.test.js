const validate = require('../../src/validators/validate');
const responseUtils = require('../../src/utils/response');
const Joi = require('joi');

jest.mock('../../src/utils/response');

describe('validate middleware', () => {
    let mockReq, mockRes, next;

    beforeEach(() => {
        mockReq = { body: {}, query: {} };
        mockRes = {};
        next = jest.fn();
        responseUtils.badRequest.mockClear();
    });

    const schema = Joi.object({
        foo: Joi.string().required(),
        bar: Joi.number().required(),
    });

    it('should call next if validation passes', () => {
        mockReq.body = { foo: 'abc', bar: 123 };
        validate(schema)(mockReq, mockRes, next);
        expect(next).toHaveBeenCalled();
        expect(responseUtils.badRequest).not.toHaveBeenCalled();
    });

    it('should call badRequest if validation fails', () => {
        mockReq.body = { foo: 'abc' };
        validate(schema)(mockReq, mockRes, next);
        expect(responseUtils.badRequest).toHaveBeenCalledWith(
            mockRes,
            'Validation failed',
            expect.arrayContaining([expect.stringContaining('"bar" is required')])
        );
        expect(next).not.toHaveBeenCalled();
    });
});

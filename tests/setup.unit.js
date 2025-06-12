const logger = require('../src/utils/logger');

jest.spyOn(logger, 'info').mockImplementation(() => {});
jest.spyOn(logger, 'warn').mockImplementation(() => {});
jest.spyOn(logger, 'error').mockImplementation(() => {});

jest.mock('mongoose', () => {
    const actual = jest.requireActual('mongoose');
    return {
        ...actual,
        createConnection: jest.fn(() => ({
            on: jest.fn(),
            model: actual.model,
        })),
    };
});

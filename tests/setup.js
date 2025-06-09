jest.spyOn(require('../src/utils/logger'), 'warn').mockImplementation(() => {});
jest.spyOn(require('../src/utils/logger'), 'error').mockImplementation(() => {});

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

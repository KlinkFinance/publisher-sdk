import { Logger } from "../../src/utils/logger";

/**
 * Mock Logger for testing
 */
export const createMockLogger = (): jest.Mocked<Logger> => {
    return {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    } as unknown as jest.Mocked<Logger>;
};

import { HttpClient } from "../../src/core/http-client";

/**
 * Mock HttpClient for testing
 */
export class MockHttpClient {
    public get = jest.fn();
    public post = jest.fn();
    public put = jest.fn();
    public delete = jest.fn();
    public patch = jest.fn();
}

export const createMockHttpClient = (): jest.Mocked<HttpClient> => {
    return {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;
};

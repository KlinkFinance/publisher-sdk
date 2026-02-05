import { PublisherClient } from "../../src/core/publisher-client";
import { HttpClient } from "../../src/core/http-client";
import { Logger } from "../../src/utils/logger";
import {
  GetOffersResponse,
  GetConversionsResponse,
  GetUsersResponse,
  GetPostbacksResponse,
  GetCountriesResponse,
  GetCategoriesResponse,
  HealthCheckResponse,
} from "../../src/types/publisher";
import { KlinkAPIError } from "../../src/types/errors";

describe("PublisherClient", () => {
    let publisherClient: PublisherClient;
    let mockHttpClient: jest.Mocked<HttpClient>;
    let mockLogger: jest.Mocked<Logger>;

    beforeEach(() => {
        // Create mocks
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
            patch: jest.fn(),
        } as unknown as jest.Mocked<HttpClient>;

        mockLogger = {
            debug: jest.fn(),
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
        } as unknown as jest.Mocked<Logger>;

        // Create client instance
        publisherClient = new PublisherClient(mockHttpClient, mockLogger);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getOffers", () => {
        const mockOffersResponse: GetOffersResponse = {
            success: true,
            data: [
                {
                    id: "offer_1",
                    name: "Test Offer",
                    category: "gaming",
                    payout: 10,
                    currency: "USD",
                },
            ],
        };

        it("should fetch offers successfully with no params", async () => {
            mockHttpClient.get.mockResolvedValue(mockOffersResponse);

            const result = await publisherClient.getOffers();

            expect(result).toEqual(mockOffersResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "api/v1/publisher/offers",
                {
                    params: { fromSDK: "1" },
                }
            );
            expect(mockLogger.debug).toHaveBeenCalled();
        });

        it("should fetch offers with pagination params", async () => {
            mockHttpClient.get.mockResolvedValue(mockOffersResponse);

            const result = await publisherClient.getOffers({
                page: 2,
                limit: 50,
            });

            expect(result).toEqual(mockOffersResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "api/v1/publisher/offers",
                {
                    params: {
                        fromSDK: "1",
                        page: "2",
                        limit: "50",
                    },
                }
            );
        });

        it("should handle category as string", async () => {
            mockHttpClient.get.mockResolvedValue(mockOffersResponse);

            await publisherClient.getOffers({
                category: "gaming",
            });

            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "api/v1/publisher/offers",
                {
                    params: {
                        fromSDK: "1",
                        category: "gaming",
                    },
                }
            );
        });

        it("should handle category as array", async () => {
            mockHttpClient.get.mockResolvedValue(mockOffersResponse);

            await publisherClient.getOffers({
                category: ["gaming", "finance"],
            });

            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "api/v1/publisher/offers",
                {
                    params: {
                        fromSDK: "1",
                        category: "gaming,finance",
                    },
                }
            );
        });

        it("should handle country as string", async () => {
            mockHttpClient.get.mockResolvedValue(mockOffersResponse);

            await publisherClient.getOffers({
                country: "US",
            });

            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "api/v1/publisher/offers",
                {
                    params: {
                        fromSDK: "1",
                        country: "US",
                    },
                }
            );
        });

        it("should handle country as array", async () => {
            mockHttpClient.get.mockResolvedValue(mockOffersResponse);

            await publisherClient.getOffers({
                country: ["US", "GB", "CA"],
            });

            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "api/v1/publisher/offers",
                {
                    params: {
                        fromSDK: "1",
                        country: "US,GB,CA",
                    },
                }
            );
        });

        it("should handle all filter parameters", async () => {
            mockHttpClient.get.mockResolvedValue(mockOffersResponse);

            await publisherClient.getOffers({
                page: 1,
                limit: 100,
                reload: true,
                category: ["gaming"],
                country: ["US"],
                device_name: "mobile",
                offer_id: "offer_123",
                name: "test",
                platform: "iOS",
                sort_by: "payout",
            });

            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "api/v1/publisher/offers",
                {
                    params: {
                        fromSDK: "1",
                        page: "1",
                        limit: "100",
                        reload: "true",
                        category: "gaming",
                        country: "US",
                        device_name: "mobile",
                        offer_id: "offer_123",
                        name: "test",
                        platform: "iOS",
                        sort_by: "payout",
                    },
                }
            );
        });

        it("should handle API errors", async () => {
            const error = new KlinkAPIError("API Error", 500);
            mockHttpClient.get.mockRejectedValue(error);

            await expect(publisherClient.getOffers()).rejects.toThrow(KlinkAPIError);
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe("getConversions", () => {
        const mockConversionsResponse: GetConversionsResponse = {
            success: true,
            data: [
                {
                    id: "conv_1",
                    offer_id: "offer_123",
                    status: "approved",
                    payout: 5.5,
                    currency: "USD",
                },
            ],
        };

        it("should fetch conversions successfully with no params", async () => {
            mockHttpClient.get.mockResolvedValue(mockConversionsResponse);

            const result = await publisherClient.getConversions();

            expect(result).toEqual(mockConversionsResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "api/v1/publisher/offers/conversions",
                {
                    params: { fromSDK: "1" },
                }
            );
        });

        it("should fetch conversions with all params", async () => {
            mockHttpClient.get.mockResolvedValue(mockConversionsResponse);

            await publisherClient.getConversions({
                page: 1,
                limit: 20,
                sort_by: "completedAt",
                sort_order: "desc",
                start_date: "2024-01-01",
                end_date: "2024-01-31",
                status: "approved",
                payout_cycle_id: "cycle_123",
                offer_id: "offer_123",
            });

            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "api/v1/publisher/offers/conversions",
                {
                    params: {
                        fromSDK: "1",
                        page: "1",
                        limit: "20",
                        sort_by: "completedAt",
                        sort_order: "desc",
                        start_date: "2024-01-01",
                        end_date: "2024-01-31",
                        status: "approved",
                        payout_cycle_id: "cycle_123",
                        offer_id: "offer_123",
                    },
                }
            );
        });

        it("should handle API errors", async () => {
            const error = new KlinkAPIError("API Error", 401);
            mockHttpClient.get.mockRejectedValue(error);

            await expect(publisherClient.getConversions()).rejects.toThrow(
                KlinkAPIError
            );
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe("getUsers", () => {
        const mockUsersResponse: GetUsersResponse = {
            success: true,
            data: [
                {
                    id: "user_1",
                    name: "John Doe",
                    email: "john@example.com",
                    status: "active",
                },
            ],
        };

        it("should fetch users successfully with no params", async () => {
            mockHttpClient.get.mockResolvedValue(mockUsersResponse);

            const result = await publisherClient.getUsers();

            expect(result).toEqual(mockUsersResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "api/v1/publisher/users",
                {
                    params: { fromSDK: "1" },
                }
            );
        });

        it("should fetch users with filters", async () => {
            mockHttpClient.get.mockResolvedValue(mockUsersResponse);

            await publisherClient.getUsers({
                page: 1,
                limit: 10,
                status: "active",
                search: "john",
            });

            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "api/v1/publisher/users",
                {
                    params: {
                        fromSDK: "1",
                        page: "1",
                        limit: "10",
                        status: "active",
                        search: "john",
                    },
                }
            );
        });

        it("should handle API errors", async () => {
            const error = new KlinkAPIError("API Error", 500);
            mockHttpClient.get.mockRejectedValue(error);

            await expect(publisherClient.getUsers()).rejects.toThrow(KlinkAPIError);
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe("getPostbacks", () => {
        const mockPostbacksResponse: GetPostbacksResponse = {
            success: true,
            data: [
                {
                    id: "pb_1",
                    name: "conversion_postback",
                    status: 200,
                    created_at: "2024-01-01T00:00:00Z",
                },
            ],
        };

        it("should fetch postbacks successfully with no params", async () => {
            mockHttpClient.get.mockResolvedValue(mockPostbacksResponse);

            const result = await publisherClient.getPostbacks();

            expect(result).toEqual(mockPostbacksResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith("api/v1/postback/logs", {
                params: { fromSDK: "1" },
            });
        });

        it("should fetch postbacks with all filters", async () => {
            mockHttpClient.get.mockResolvedValue(mockPostbacksResponse);

            await publisherClient.getPostbacks({
                page: 1,
                limit: 20,
                sort_by: "created_at",
                sort_order: "desc",
                start_date: "2024-01-01",
                end_date: "2024-01-31",
                name: "conversion_postback",
                status: 200,
                id: "pb_123",
            });

            expect(mockHttpClient.get).toHaveBeenCalledWith("api/v1/postback/logs", {
                params: {
                    fromSDK: "1",
                    page: "1",
                    limit: "20",
                    sort_by: "created_at",
                    sort_order: "desc",
                    start_date: "2024-01-01",
                    end_date: "2024-01-31",
                    name: "conversion_postback",
                    status: "200",
                    id: "pb_123",
                },
            });
        });

        it("should handle status as number", async () => {
            mockHttpClient.get.mockResolvedValue(mockPostbacksResponse);

            await publisherClient.getPostbacks({
                status: 404,
            });

            expect(mockHttpClient.get).toHaveBeenCalledWith("api/v1/postback/logs", {
                params: {
                    fromSDK: "1",
                    status: "404",
                },
            });
        });

        it("should handle API errors", async () => {
            const error = new KlinkAPIError("API Error", 500);
            mockHttpClient.get.mockRejectedValue(error);

            await expect(publisherClient.getPostbacks()).rejects.toThrow(
                KlinkAPIError
            );
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe("getCountries", () => {
        const mockCountriesResponse: GetCountriesResponse = {
            success: true,
            data: [
                { code: "US", name: "United States" },
                { code: "GB", name: "United Kingdom" },
                { code: "CA", name: "Canada" },
            ],
        };

        it("should fetch countries successfully with no params", async () => {
            mockHttpClient.get.mockResolvedValue(mockCountriesResponse);

            const result = await publisherClient.getCountries();

            expect(result).toEqual(mockCountriesResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "api/v1/publisher/countries",
                {
                    params: { fromSDK: "1" },
                }
            );
            expect(mockLogger.debug).toHaveBeenCalled();
        });

        it("should fetch countries with reload false", async () => {
            mockHttpClient.get.mockResolvedValue(mockCountriesResponse);

            await publisherClient.getCountries(false);

            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "api/v1/publisher/countries",
                {
                    params: { fromSDK: "1", reload: "false" },
                }
            );
        });

        it("should fetch countries with reload true", async () => {
            mockHttpClient.get.mockResolvedValue(mockCountriesResponse);

            await publisherClient.getCountries(true);

            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "api/v1/publisher/countries",
                {
                    params: { fromSDK: "1", reload: "true" },
                }
            );
        });

        it("should handle API errors", async () => {
            const error = new KlinkAPIError("API Error", 500);
            mockHttpClient.get.mockRejectedValue(error);

            await expect(publisherClient.getCountries()).rejects.toThrow(
                KlinkAPIError
            );
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe("getCategories", () => {
        const mockCategoriesResponse: GetCategoriesResponse = {
            success: true,
            data: [
                { name: "Gaming", slug: "gaming" },
                { name: "Finance", slug: "finance" },
                { name: "Shopping", slug: "shopping" },
            ],
        };

        it("should fetch categories successfully with no params", async () => {
            mockHttpClient.get.mockResolvedValue(mockCategoriesResponse);

            const result = await publisherClient.getCategories();

            expect(result).toEqual(mockCategoriesResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "api/v1/publisher/categories",
                {
                    params: { fromSDK: "1" },
                }
            );
            expect(mockLogger.debug).toHaveBeenCalled();
        });

        it("should fetch categories with reload false", async () => {
            mockHttpClient.get.mockResolvedValue(mockCategoriesResponse);

            await publisherClient.getCategories(false);

            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "api/v1/publisher/categories",
                {
                    params: { fromSDK: "1", reload: "false" },
                }
            );
        });

        it("should fetch categories with reload true", async () => {
            mockHttpClient.get.mockResolvedValue(mockCategoriesResponse);

            await publisherClient.getCategories(true);

            expect(mockHttpClient.get).toHaveBeenCalledWith(
                "api/v1/publisher/categories",
                {
                    params: { fromSDK: "1", reload: "true" },
                }
            );
        });

        it("should handle API errors", async () => {
            const error = new KlinkAPIError("API Error", 500);
            mockHttpClient.get.mockRejectedValue(error);

            await expect(publisherClient.getCategories()).rejects.toThrow(
                KlinkAPIError
            );
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe("healthCheck", () => {
        const mockHealthResponse: HealthCheckResponse = {
            status: "ok",
            message: "API is healthy",
            timestamp: "2024-01-01T00:00:00Z",
        };

        it("should check health successfully", async () => {
            mockHttpClient.get.mockResolvedValue(mockHealthResponse);

            const result = await publisherClient.healthCheck();

            expect(result).toEqual(mockHealthResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith("api/v1/health");
            expect(mockLogger.debug).toHaveBeenCalled();
        });

        it("should handle health check errors", async () => {
            const error = new KlinkAPIError("Health check failed", 500);
            mockHttpClient.get.mockRejectedValue(error);

            await expect(publisherClient.healthCheck()).rejects.toThrow(
                KlinkAPIError
            );
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe("createQuestRedirectToken", () => {
        const validParams = {
            offerId: "4096",
            sub: "pub-user1",
            pub: "271e6dc9-d2fd-4f21-bba4-cdabc9df3ad2",
        };
        const secret = "test-jwt-secret";

        it("should create JWT token with required params", () => {
            const result = publisherClient.createQuestRedirectToken(validParams, secret);

            expect(result).toHaveProperty("token");
            expect(result).toHaveProperty("expiresAt");
            expect(typeof result.token).toBe("string");
            expect(typeof result.expiresAt).toBe("number");
            expect(result.expiresAt).toBeGreaterThan(Date.now() / 1000);
        });

        it("should create JWT token with custom expiration", () => {
            const result = publisherClient.createQuestRedirectToken(
                { ...validParams, expirationMinutes: 30 },
                secret
            );

            const expectedExpiration = Math.floor(Date.now() / 1000) + 30 * 60;
            expect(result.expiresAt).toBeGreaterThanOrEqual(expectedExpiration - 2);
            expect(result.expiresAt).toBeLessThanOrEqual(expectedExpiration + 2);
        });

        it("should create JWT token with custom params", () => {
            const result = publisherClient.createQuestRedirectToken(
                {
                    ...validParams,
                    custom_params: {
                        k1: "custom1",
                        k2: "custom2",
                        k3: "custom3",
                    },
                },
                secret
            );

            expect(result).toHaveProperty("token");
            expect(typeof result.token).toBe("string");
        });

        it("should use default expiration of 10 minutes", () => {
            const result = publisherClient.createQuestRedirectToken(validParams, secret);

            const expectedExpiration = Math.floor(Date.now() / 1000) + 10 * 60;
            expect(result.expiresAt).toBeGreaterThanOrEqual(expectedExpiration - 2);
            expect(result.expiresAt).toBeLessThanOrEqual(expectedExpiration + 2);
        });

        it("should throw error when offerId is missing", () => {
            expect(() => {
                publisherClient.createQuestRedirectToken(
                    { ...validParams, offerId: "" },
                    secret
                );
            }).toThrow("offerId, sub, and pub are required");
        });

        it("should throw error when sub is missing", () => {
            expect(() => {
                publisherClient.createQuestRedirectToken(
                    { ...validParams, sub: "" },
                    secret
                );
            }).toThrow("offerId, sub, and pub are required");
        });

        it("should throw error when pub is missing", () => {
            expect(() => {
                publisherClient.createQuestRedirectToken(
                    { ...validParams, pub: "" },
                    secret
                );
            }).toThrow("offerId, sub, and pub are required");
        });

        it("should throw error when secret is empty", () => {
            expect(() => {
                publisherClient.createQuestRedirectToken(validParams, "");
            }).toThrow("JWT secret is required");
        });

        it("should log debug messages", () => {
            publisherClient.createQuestRedirectToken(validParams, secret);

            expect(mockLogger.debug).toHaveBeenCalledWith(
                "Creating quest redirect token with params:",
                validParams
            );
            expect(mockLogger.debug).toHaveBeenCalledWith(
                "JWT token created successfully"
            );
        });
    });
});

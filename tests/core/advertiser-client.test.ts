import { AdvertiserClient } from "../../src/core/advertiser-client";
import { HttpClient } from "../../src/core/http-client";
import { Logger } from "../../src/utils/logger";
import {
    SendPostbackResponse,
    SendPostbackParams,
} from "../../src/types/advertiser";
import { HealthCheckResponse } from "../../src/types";
import { KlinkAPIError } from "../../src/types/errors";

describe("AdvertiserClient", () => {
    let advertiserClient: AdvertiserClient;
    let mockHttpClient: jest.Mocked<HttpClient>;
    let mockLogger: jest.Mocked<Logger>;
    const testApiKey = "test-api-key-123";

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
        advertiserClient = new AdvertiserClient(
            mockHttpClient,
            mockLogger,
            testApiKey
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("healthCheck", () => {
        const mockHealthResponse: HealthCheckResponse = {
            status: "ok",
            message: "API is healthy",
            timestamp: "2024-01-01T00:00:00Z",
        };

        it("should check health successfully", async () => {
            mockHttpClient.get.mockResolvedValue(mockHealthResponse);

            const result = await advertiserClient.healthCheck();

            expect(result).toEqual(mockHealthResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith("api/v1/health");
            expect(mockLogger.debug).toHaveBeenCalledWith("Checking API health");
            expect(mockLogger.debug).toHaveBeenCalledWith(
                "Health check response:",
                mockHealthResponse
            );
        });

        it("should handle health check errors", async () => {
            const error = new KlinkAPIError("Health check failed", 500);
            mockHttpClient.get.mockRejectedValue(error);

            await expect(advertiserClient.healthCheck()).rejects.toThrow(
                KlinkAPIError
            );
            expect(mockLogger.error).toHaveBeenCalledWith(
                "Health check failed:",
                error
            );
        });

        it("should log debug messages during health check", async () => {
            mockHttpClient.get.mockResolvedValue(mockHealthResponse);

            await advertiserClient.healthCheck();

            expect(mockLogger.debug).toHaveBeenCalledTimes(2);
        });
    });

    describe("sendPostback", () => {
        const validParams: SendPostbackParams = {
            event_name: "create_account",
            offer_id: "offer_123",
            sub1: "sub1_value",
            tx_id: "transaction_id_123",
            isChargeback: false,
            chargebackReason: "",
            isTest: true,
        };

        const mockPostbackResponse: SendPostbackResponse = {
            success: true,
            message: "Postback sent successfully",
            data: { id: "pb_123" },
        };

        it("should send postback successfully with all required params", async () => {
            mockHttpClient.get.mockResolvedValue(mockPostbackResponse);

            const result = await advertiserClient.sendPostback(validParams);

            expect(result).toEqual(mockPostbackResponse);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `api/v1/affiliate/advertiser/pb/${testApiKey}`,
                {
                    params: {
                        event_name: "create_account",
                        offer_id: "offer_123",
                        sub1: "sub1_value",
                        tx_id: "transaction_id_123",
                        isChargeback: "false",
                        chargebackReason: "",
                        isTest: "true",
                    },
                }
            );
            expect(mockLogger.debug).toHaveBeenCalled();
        });

        it("should convert boolean values to strings correctly", async () => {
            mockHttpClient.get.mockResolvedValue(mockPostbackResponse);

            await advertiserClient.sendPostback({
                ...validParams,
                isChargeback: true,
                isTest: false,
            });

            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `api/v1/affiliate/advertiser/pb/${testApiKey}`,
                {
                    params: expect.objectContaining({
                        isChargeback: "true",
                        isTest: "false",
                    }),
                }
            );
        });

        it("should handle chargeback reason", async () => {
            mockHttpClient.get.mockResolvedValue(mockPostbackResponse);

            await advertiserClient.sendPostback({
                ...validParams,
                chargebackReason: "Fraudulent transaction",
            });

            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `api/v1/affiliate/advertiser/pb/${testApiKey}`,
                {
                    params: expect.objectContaining({
                        chargebackReason: "Fraudulent transaction",
                    }),
                }
            );
        });

        it("should throw error when event_name is missing", async () => {
            const invalidParams = {
                ...validParams,
                event_name: "",
            };

            await expect(
                advertiserClient.sendPostback(invalidParams as SendPostbackParams)
            ).rejects.toThrow("event_name, offer_id, sub1, and tx_id are required");
        });

        it("should throw error when offer_id is missing", async () => {
            const invalidParams = {
                ...validParams,
                offer_id: "",
            };

            await expect(
                advertiserClient.sendPostback(invalidParams as SendPostbackParams)
            ).rejects.toThrow("event_name, offer_id, sub1, and tx_id are required");
        });

        it("should throw error when sub1 is missing", async () => {
            const invalidParams = {
                ...validParams,
                sub1: "",
            };

            await expect(
                advertiserClient.sendPostback(invalidParams as SendPostbackParams)
            ).rejects.toThrow("event_name, offer_id, sub1, and tx_id are required");
        });

        it("should throw error when tx_id is missing", async () => {
            const invalidParams = {
                ...validParams,
                tx_id: "",
            };

            await expect(
                advertiserClient.sendPostback(invalidParams as SendPostbackParams)
            ).rejects.toThrow("event_name, offer_id, sub1, and tx_id are required");
        });

        it("should throw error when event_name is undefined", async () => {
            const invalidParams = {
                ...validParams,
                event_name: undefined as unknown as string,
            };

            await expect(
                advertiserClient.sendPostback(invalidParams as SendPostbackParams)
            ).rejects.toThrow("event_name, offer_id, sub1, and tx_id are required");
        });

        it("should use correct API key in URL path", async () => {
            const differentApiKey = "different-api-key";
            const client = new AdvertiserClient(
                mockHttpClient,
                mockLogger,
                differentApiKey
            );

            mockHttpClient.get.mockResolvedValue(mockPostbackResponse);

            await client.sendPostback(validParams);

            expect(mockHttpClient.get).toHaveBeenCalledWith(
                `api/v1/affiliate/advertiser/pb/${differentApiKey}`,
                expect.any(Object)
            );
        });

        it("should handle API errors", async () => {
            const error = new KlinkAPIError("API Error", 400);
            mockHttpClient.get.mockRejectedValue(error);

            await expect(advertiserClient.sendPostback(validParams)).rejects.toThrow(
                KlinkAPIError
            );
            expect(mockLogger.error).toHaveBeenCalledWith(
                "Error sending postback:",
                error
            );
        });

        it("should log debug messages during postback", async () => {
            mockHttpClient.get.mockResolvedValue(mockPostbackResponse);

            await advertiserClient.sendPostback(validParams);

            expect(mockLogger.debug).toHaveBeenCalledWith(
                "Sending postback with params:",
                validParams
            );
            expect(mockLogger.debug).toHaveBeenCalledWith(
                "Postback response:",
                mockPostbackResponse
            );
        });

        it("should handle different event names", async () => {
            mockHttpClient.get.mockResolvedValue(mockPostbackResponse);

            const eventNames = ["create_account", "conversion", "purchase"];

            for (const eventName of eventNames) {
                await advertiserClient.sendPostback({
                    ...validParams,
                    event_name: eventName,
                });

                expect(mockHttpClient.get).toHaveBeenCalledWith(
                    expect.any(String),
                    {
                        params: expect.objectContaining({
                            event_name: eventName,
                        }),
                    }
                );
            }
        });

        it("should handle empty chargeback reason", async () => {
            mockHttpClient.get.mockResolvedValue(mockPostbackResponse);

            await advertiserClient.sendPostback({
                ...validParams,
                chargebackReason: "",
            });

            expect(mockHttpClient.get).toHaveBeenCalledWith(
                expect.any(String),
                {
                    params: expect.objectContaining({
                        chargebackReason: "",
                    }),
                }
            );
        });
    });
});

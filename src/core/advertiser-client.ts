import { HttpClient } from "./http-client";
import { Logger } from "../utils/logger";
import { HealthCheckResponse } from "../types";
import { SendPostbackParams, SendPostbackResponse } from "../types/advertiser";

/**
 * Advertiser client for sending postbacks and conversion events
 */
export class AdvertiserClient {
  private logger: Logger;
  private httpClient: HttpClient;
  private apiKey: string;

  constructor(httpClient: HttpClient, logger: Logger, apiKey: string) {
    this.httpClient = httpClient;
    this.logger = logger;
    this.apiKey = apiKey;
    this.logger.info("Advertiser client initialized");
  }

  /**
   * Health check endpoint
   *
   * @returns Promise with health status
   *
   * @example
   * ```typescript
   * const health = await advertiser.healthCheck();
   * console.log(health.status); // 'ok' or 'healthy'
   * ```
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    this.logger.debug("Checking API health");

    try {
      const response = await this.httpClient.get<HealthCheckResponse>("api/v1/health");
      this.logger.debug("Health check response:", response);
      return response;
    } catch (error) {
      this.logger.error("Health check failed:", error);
      throw error;
    }
  }

  /**
   * Send a postback for the advertiser
   *
   * @param params - Parameters for the postback
   * @returns Promise with postback response
   *
   * @example
   * ```typescript
   * const response = await advertiser.sendPostback({
   *   event_name: 'create_account',
   *   offer_id: 'offer_123',
   *   sub1: 'sub1_value',
   *   tx_id: 'transaction_id',
   *   isChargeback: false,
   *   chargebackReason: '',
   *   isTest: true
   * });
   * ```
   */
  async sendPostback(params: SendPostbackParams): Promise<SendPostbackResponse> {
    this.logger.debug("Sending postback with params:", params);

    // Validate required parameters
    if (!params.event_name || !params.offer_id || !params.sub1 || !params.tx_id) {
      throw new Error("event_name, offer_id, sub1, and tx_id are required");
    }

    try {
      // Build query parameters
      const queryParams: Record<string, string> = {
        event_name: params.event_name,
        offer_id: params.offer_id,
        sub1: params.sub1,
        tx_id: params.tx_id,
        isChargeback: params.isChargeback ? "true" : "false",
        chargebackReason: params.chargebackReason ? params.chargebackReason : "",
        isTest: params.isTest ? "true" : "false",
      };

      // Make GET request to postback endpoint
      // advertiserId in the URL path is the API key
      const response = await this.httpClient.get<SendPostbackResponse>(
        `api/v1/affiliate/advertiser/pb/${this.apiKey}`,
        { params: queryParams }
      );

      this.logger.debug("Postback response:", response);

      return response;
    } catch (error) {
      this.logger.error("Error sending postback:", error);
      throw error;
    }
  }
}

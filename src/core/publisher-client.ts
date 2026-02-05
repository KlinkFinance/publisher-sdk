import { HttpClient } from "./http-client";
import { Logger } from "../utils/logger";
import * as jwt from "jsonwebtoken";
import {
  GetOffersParams,
  GetOffersResponse,
  GetConversionsParams,
  GetConversionsResponse,
  GetUsersParams,
  GetUsersResponse,
  GetPostbacksParams,
  GetPostbacksResponse,
  GetCountriesResponse,
  GetCategoriesResponse,
  HealthCheckResponse,
  SendPublisherPostbackParams,
  SendPublisherPostbackResponse,
  CreateQuestRedirectTokenParams,
  CreateQuestRedirectTokenResponse,
} from "../types/publisher";

/**
 * Publisher client for fetching offers and tracking events
 */
export class PublisherClient {
  private httpClient: HttpClient;
  private logger: Logger;

  constructor(httpClient: HttpClient, logger: Logger) {
    this.httpClient = httpClient;
    this.logger = logger;
    this.logger.info("Publisher client initialized");
  }

  /**
   * Fetch offers for publishers with optional filters
   *
   * @param params - Query parameters for filtering offers
   * @returns Promise with offers data
   *
   * @example
   * ```typescript
   * const offers = await publisher.getOffers({
   *   page: 1,
   *   limit: 50,
   *   category: ['gaming', 'finance'],
   *   country: 'US',
   *   device_name: 'mobile'
   * });
   * ```
   */
  async getOffers(params?: GetOffersParams): Promise<GetOffersResponse> {
    this.logger.debug("Fetching offers with params:", params);

    try {
      // Build query parameters
      const queryParams: Record<string, string> = {};
      queryParams.fromSDK = "1";

      if (params) {
        // Handle page, limit, reload
        if (params.page !== undefined) {
          queryParams.page = params.page.toString();
        }
        if (params.limit !== undefined) {
          queryParams.limit = params.limit.toString();
        }
        if (params.reload !== undefined) {
          queryParams.reload = params.reload.toString();
        }

        // Handle category - can be string or array
        if (params.category !== undefined) {
          if (Array.isArray(params.category)) {
            queryParams.category = params.category.join(",");
          } else {
            queryParams.category = params.category;
          }
        }

        // Handle country - can be string or array
        if (params.country !== undefined) {
          if (Array.isArray(params.country)) {
            queryParams.country = params.country.join(",");
          } else {
            queryParams.country = params.country;
          }
        }

        // Handle other string parameters
        if (params.device_name) {
          queryParams.device_name = params.device_name;
        }
        if (params.offer_id) {
          queryParams.offer_id = params.offer_id;
        }
        if (params.name) {
          queryParams.name = params.name;
        }
        if (params.platform) {
          queryParams.platform = params.platform;
        }
        if (params.sort_by) {
          queryParams.sort_by = params.sort_by;
        }
      }

      // Make GET request to offers endpoint
      const response = await this.httpClient.get<GetOffersResponse>("api/v1/publisher/offers", {
        params: queryParams,
      });

      this.logger.debug(`Fetched ${response.data?.length || 0} offers`);

      return response;
    } catch (error) {
      this.logger.error("Error fetching offers:", error);
      throw error;
    }
  }

  /**
   * Fetch conversions for publishers with optional filters
   *
   * @param params - Query parameters for filtering conversions
   * @returns Promise with conversions data
   *
   * @example
   * ```typescript
   * const conversions = await publisher.getConversions({
   *   page: 1,
   *   limit: 20,
   *   start_date: '2024-01-01',
   *   end_date: '2024-01-31',
   *   status: 'approved',
   *   offer_id: 'offer_123'
   * });
   * ```
   */
  async getConversions(params?: GetConversionsParams): Promise<GetConversionsResponse> {
    this.logger.debug("Fetching conversions with params:", params);

    try {
      // Build query parameters
      const queryParams: Record<string, string> = {};
      queryParams.fromSDK = "1";

      if (params) {
        // Handle page and limit
        if (params.page !== undefined) {
          queryParams.page = params.page.toString();
        }
        if (params.limit !== undefined) {
          queryParams.limit = params.limit.toString();
        }

        // Handle sorting
        if (params.sort_by) {
          queryParams.sort_by = params.sort_by;
        }
        if (params.sort_order) {
          queryParams.sort_order = params.sort_order;
        }

        // Handle date filters
        if (params.start_date) {
          queryParams.start_date = params.start_date;
        }
        if (params.end_date) {
          queryParams.end_date = params.end_date;
        }

        // Handle status filter
        if (params.status) {
          queryParams.status = params.status;
        }

        // Handle payout cycle filter
        if (params.payout_cycle_id) {
          queryParams.payout_cycle_id = params.payout_cycle_id;
        }

        // Handle offer ID filter
        if (params.offer_id) {
          queryParams.offer_id = params.offer_id;
        }
      }

      // Make GET request to conversions endpoint
      const response = await this.httpClient.get<GetConversionsResponse>(
        "api/v1/publisher/offers/conversions",
        { params: queryParams }
      );

      this.logger.debug(`Fetched ${response.data?.length || 0} conversions`);

      return response;
    } catch (error) {
      this.logger.error("Error fetching conversions:", error);
      throw error;
    }
  }

  /**
   * Fetch users for the publisher with optional filters
   *
   * @param params - Query parameters for filtering users
   * @returns Promise with users data
   *
   * @example
   * ```typescript
   * const users = await publisher.getUsers({
   *   page: 1,
   *   limit: 20,
   *   status: 'active',
   *   search: 'john'
   * });
   * ```
   */
  async getUsers(params?: GetUsersParams): Promise<GetUsersResponse> {
    this.logger.debug("Fetching users with params:", params);

    try {
      // Build query parameters
      const queryParams: Record<string, string> = {};

      queryParams.fromSDK = "1";
      if (params) {
        // Handle page and limit
        if (params.page !== undefined) {
          queryParams.page = params.page.toString();
        }
        if (params.limit !== undefined) {
          queryParams.limit = params.limit.toString();
        }

        // Handle status filter
        if (params.status) {
          queryParams.status = params.status;
        }

        // Handle search
        if (params.search) {
          queryParams.search = params.search;
        }
      }

      // Make GET request to users endpoint
      const response = await this.httpClient.get<GetUsersResponse>("api/v1/publisher/users", {
        params: queryParams,
      });

      this.logger.debug(`Fetched ${response.data?.length || 0} users`);

      return response;
    } catch (error) {
      this.logger.error("Error fetching users:", error);
      throw error;
    }
  }

  /**
   * Fetch postback logs for the publisher with optional filters
   *
   * @param params - Query parameters for filtering postback logs
   * @returns Promise with postback logs data
   *
   * @example
   * ```typescript
   * const postbacks = await publisher.getPostbacks({
   *   page: 1,
   *   limit: 20,
   *   start_date: '2024-01-01',
   *   end_date: '2024-01-31',
   *   status: 200,
   *   name: 'conversion_postback'
   * });
   * ```
   */
  async getPostbacks(params?: GetPostbacksParams): Promise<GetPostbacksResponse> {
    this.logger.debug("Fetching postbacks with params:", params);

    try {
      // Build query parameters
      const queryParams: Record<string, string> = {};
      queryParams.fromSDK = "1";

      if (params) {
        // Handle page and limit
        if (params.page !== undefined) {
          queryParams.page = params.page.toString();
        }
        if (params.limit !== undefined) {
          queryParams.limit = params.limit.toString();
        }

        // Handle sorting
        if (params.sort_by) {
          queryParams.sort_by = params.sort_by;
        }
        if (params.sort_order) {
          queryParams.sort_order = params.sort_order;
        }

        // Handle date filters
        if (params.start_date) {
          queryParams.start_date = params.start_date;
        }
        if (params.end_date) {
          queryParams.end_date = params.end_date;
        }

        // Handle name filter
        if (params.name) {
          queryParams.name = params.name;
        }

        // Handle status filter (numeric)
        if (params.status !== undefined) {
          queryParams.status = params.status.toString();
        }

        // Handle postback ID filter
        if (params.id) {
          queryParams.id = params.id;
        }
      }

      // Make GET request to postbacks/logs endpoint
      const response = await this.httpClient.get<GetPostbacksResponse>("api/v1/postback/logs", {
        params: queryParams,
      });

      this.logger.debug(`Fetched ${response.data?.length || 0} postbacks`);

      return response;
    } catch (error) {
      this.logger.error("Error fetching postbacks:", error);
      throw error;
    }
  }

  /**
   * Fetch supported countries
   *
   * @param reload - Force reload (bypass cache)
   * @returns Promise with countries data
   *
   * @example
   * ```typescript
   * const countries = await publisher.getCountries();
   * // or with reload
   * const countries = await publisher.getCountries(true);
   * ```
   */
  async getCountries(reload?: boolean): Promise<GetCountriesResponse> {
    this.logger.debug("Fetching countries with reload:", reload);

    try {
      // Build query parameters
      const queryParams: Record<string, string> = {};
      queryParams.fromSDK = "1";

      if (reload !== undefined) {
        queryParams.reload = reload.toString();
      }

      // Make GET request to countries endpoint
      const response = await this.httpClient.get<GetCountriesResponse>(
        "api/v1/publisher/countries",
        { params: queryParams }
      );

      this.logger.debug(`Fetched ${response.data?.length || 0} countries`);

      return response;
    } catch (error) {
      this.logger.error("Error fetching countries:", error);
      throw error;
    }
  }

  /**
   * Fetch supported categories
   *
   * @param reload - Force reload (bypass cache)
   * @returns Promise with categories data
   *
   * @example
   * ```typescript
   * const categories = await publisher.getCategories();
   * // or with reload
   * const categories = await publisher.getCategories(true);
   * ```
   */
  async getCategories(reload?: boolean): Promise<GetCategoriesResponse> {
    this.logger.debug("Fetching categories with reload:", reload);

    try {
      // Build query parameters
      const queryParams: Record<string, string> = {};
      queryParams.fromSDK = "1";

      if (reload !== undefined) {
        queryParams.reload = reload.toString();
      }

      // Make GET request to categories endpoint
      const response = await this.httpClient.get<GetCategoriesResponse>(
        "api/v1/publisher/categories",
        { params: queryParams }
      );

      this.logger.debug(`Fetched ${response.data?.length || 0} categories`);

      return response;
    } catch (error) {
      this.logger.error("Error fetching categories:", error);
      throw error;
    }
  }

  /**
   * Health check endpoint
   *
   * @returns Promise with health status
   *
   * @example
   * ```typescript
   * const health = await publisher.healthCheck();
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
   * Send postback from Publisher SDK
   *
   * @param params - Postback parameters (any valid JSON object)
   * @returns Promise with postback response
   *
   * @example
   * ```typescript
   * const response = await publisher.sendTestPostback({
   *   params: {
   *     event_name: "conversion",
   *     offer_id: "offer_123",
   *     user_id: "user_456",
   *     amount: 100,
   *     currency: "USD"
   *   }
   * });
   * ```
   */
  async sendPostback(
    params?: SendPublisherPostbackParams
  ): Promise<SendPublisherPostbackResponse> {
    this.logger.debug("Sending postback with params:", params);

    try {
      // Build request body
      const body = {
        params: params?.params || {},
      };

      // Make POST request to send-postback endpoint
      const response = await this.httpClient.post<SendPublisherPostbackResponse>(
        "api/v1/publisher/send-postback",
        body
      );

      this.logger.debug("Postback sent successfully:", response);

      return response;
    } catch (error) {
      this.logger.error("Error sending postback:", error);
      throw error;
    }
  }

  /**
   * Create Quest Redirect Token (JWT)
   * 
   * Generates a JWT token with the provided payload for quest redirects.
   * This is a local operation - no API call is made.
   * 
   * @param params - Token parameters
   * @param secret - JWT secret for signing the token
   * @returns Token data with token string and expiration timestamp
   * 
   * @example
   * ```typescript
   * const tokenData = publisher.createQuestRedirectToken(
   *   {
   *     offerId: "4096",
   *     sub: "pub-user1",
   *     pub: "271e6dc9-d2fd-4f21-bba4-cdabc9df3ad2",
   *     expirationMinutes: 10,
   *     custom_params: {
   *       k1: "custom1",
   *       k2: "custom2",
   *       k3: "custom3",
   *     }
   *   },
   *   "your-jwt-secret"
   * );
   * console.log(tokenData.token);
   * console.log(tokenData.expiresAt);
   * ```
   */
  createQuestRedirectToken(
    params: CreateQuestRedirectTokenParams,
    secret: string
  ): CreateQuestRedirectTokenResponse {
    this.logger.debug("Creating quest redirect token with params:", params);

    // Validate required parameters
    if (!params.offerId || !params.sub || !params.pub) {
      throw new Error("offerId, sub, and pub are required");
    }

    if (!secret || secret.trim() === "") {
      throw new Error("JWT secret is required");
    }

    try {
      // Calculate expiration time
      const expirationMinutes = params.expirationMinutes ?? 10;
      const expiresAt = Math.floor(Date.now() / 1000) + expirationMinutes * 60;

      // Build JWT payload
      const payload: Record<string, any> = {
        offerId: params.offerId,
        exp: expiresAt,
        sub: params.sub,
        pub: params.pub,
      };

      // Add custom params if provided
      if (params.custom_params) {
        payload.custom_params = params.custom_params;
      }

      this.logger.debug("JWT payload:", payload);

      // Sign the token
      const token = jwt.sign(payload, secret);

      this.logger.debug("JWT token created successfully");

      return {
        token,
        expiresAt,
      };
    } catch (error) {
      this.logger.error("Error creating quest redirect token:", error);
      throw error;
    }
  }
}

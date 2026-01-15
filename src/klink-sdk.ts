import { KlinkSDKConfig, ResolvedKlinkSDKConfig } from "./types/config";
import { validateConfig } from "./utils/validator";
import { Logger } from "./utils/logger";
import { HttpClient } from "./core/http-client";
import { PublisherClient } from "./core/publisher-client";
import { AdvertiserClient } from "./core/advertiser-client";
import { HealthCheckResponse } from "./types/publisher";
import axios, { AxiosResponse } from "axios";
import { KlinkAPIError, KlinkNetworkError } from "./types/errors";

/**
 * Main SDK class for Klink API
 * Provides access to both Publisher and Advertiser clients
 * The backend middleware validates user_type based on API credentials
 */
export class KlinkSDK {
  private config: ResolvedKlinkSDKConfig;
  private logger: Logger;
  private httpClient: HttpClient;
  private _publisherClient: PublisherClient;
  private _advertiserClient: AdvertiserClient;

  /**
   * Private constructor - use KlinkSDK.create() factory method instead
   * This ensures health check is performed before SDK initialization
   * @private
   */
  private constructor(config: KlinkSDKConfig) {
    // Validate configuration
    validateConfig(config);

    // Resolve config with defaults
    this.config = this.resolveConfig(config);

    // Initialize logger
    this.logger = new Logger(this.config.debug);

    this.logger.info("Initializing Klink SDK", {
      baseUrl: this.config.baseUrl,
    });

    // Initialize HTTP client
    this.httpClient = new HttpClient(this.config, this.logger);

    // Initialize both clients - backend middleware will validate user_type
    this._publisherClient = new PublisherClient(this.httpClient, this.logger);
    this._advertiserClient = new AdvertiserClient(
      this.httpClient,
      this.logger,
      this.config.apiKey
    );

    this.logger.info("Klink SDK initialized successfully");
  }

  /**
   * Factory method to create SDK instance with async health check
   * This is the recommended way to initialize the SDK with health check validation
   * 
   * The health check ensures the API is accessible (status 200) before initializing the SDK.
   * If health check fails, the SDK instance will not be created and an error will be thrown.
   * 
   * @param config - SDK configuration
   * @returns Promise that resolves to KlinkSDK instance
   * @throws {KlinkAPIError} If health check fails (non-200 status)
   * @throws {KlinkNetworkError} If health check times out or network error occurs
   * 
   * @example
   * ```typescript
   * // Recommended: Use factory method with health check
   * const client = await KlinkSDK.create({
   *   apiKey: "your-key",
   *   apiSecret: "your-secret",
   * });
   * 
   * // If health check fails, this will throw an error and client won't be created
   * ```
   */
  static async create(config: KlinkSDKConfig): Promise<KlinkSDK> {
    // Validate configuration
    validateConfig(config);

    // Resolve config with defaults
    const resolvedConfig: ResolvedKlinkSDKConfig = {
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
      baseUrl: config.baseUrl || "https://klink-quest.klink.finance",
      timeoutMs: config.timeoutMs ?? 8000,
      debug: config.debug ?? false,
    };

    // Initialize logger
    const logger = new Logger(resolvedConfig.debug);

    logger.info("Initializing Klink SDK with health check", {
      baseUrl: resolvedConfig.baseUrl,
    });

    // Perform health check before creating SDK instance
    // This will throw an error if status is not 200
    await KlinkSDK.performHealthCheck(resolvedConfig, logger);

    // Create SDK instance (health check already passed)
    return new KlinkSDK(config);
  }

  /**
   * Perform health check during initialization
   * Throws error if health check fails (non-200 status)
   * @private
   * @static
   */
  private static async performHealthCheck(
    config: ResolvedKlinkSDKConfig,
    logger: Logger
  ): Promise<void> {
    logger.debug("Performing health check during SDK initialization");

    try {
      // Create a temporary axios instance for health check
      // We need to check the status code, so we use axios directly

      const response: AxiosResponse<HealthCheckResponse> = await axios.get(
        `${config.baseUrl}/api/v1/health`,
        {
          timeout: config.timeoutMs,
          validateStatus: (status) => status < 500, // Don't throw on 4xx, we'll handle it
        }
      );

      // Check if status is 200
      if (response.status !== 200) {
        const errorMessage = `Health check failed with status ${response.status}. API is not available.`;
        logger.error(errorMessage);
        throw new KlinkAPIError(
          errorMessage,
          response.status,
          response.data
        );
      }

      logger.info("Health check passed", {
        status: response.status,
        healthStatus: response.data?.status,
      });
    } catch (error) {
      // Handle network/timeout errors
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
          const networkError = new KlinkNetworkError(
            `Health check timeout: Unable to reach API at ${config.baseUrl}`
          );
          logger.error("Health check failed:", networkError.message);
          throw networkError;
        }
        if (error.response) {
          // API returned an error response
          const apiError = new KlinkAPIError(
            `Health check failed with status ${error.response.status}. API is not available.`,
            error.response.status,
            error.response.data
          );
          logger.error("Health check failed:", apiError.message);
          throw apiError;
        }
        // Network error (no response)
        const networkError = new KlinkNetworkError(
          `Health check failed: ${error.message}. Unable to reach API at ${config.baseUrl}`
        );
        logger.error("Health check failed:", networkError.message);
        throw networkError;
      }

      // Re-throw if it's already a KlinkSDKError
      if (error instanceof KlinkAPIError || error instanceof KlinkNetworkError) {
        throw error;
      }

      // Unknown error
      const unknownError = new KlinkNetworkError(
        `Health check failed: ${error instanceof Error ? error.message : String(error)}`
      );
      logger.error("Health check failed:", unknownError.message);
      throw unknownError;
    }
  }

  /**
   * Resolve configuration with defaults
   */
  private resolveConfig(config: KlinkSDKConfig): ResolvedKlinkSDKConfig {
    return {
      apiKey: config.apiKey,
      apiSecret: config.apiSecret, // Optional - undefined if not provided
      baseUrl: config.baseUrl || "https://klink-quest.klink.finance",
      // baseUrl: config.baseUrl || "http://localhost:4000",
      timeoutMs: config.timeoutMs ?? 8000,
      debug: config.debug ?? false,
    };
  }

  /**
   * Get the Publisher client
   * Note: apiSecret is required for Publisher APIs. Backend middleware validates user_type.
   * @throws {Error} If apiSecret is not provided
   */
  get publisher(): PublisherClient {
    if (!this.config.apiSecret) {
      throw new Error(
        "apiSecret is required for Publisher APIs. Please provide apiSecret in SDK configuration."
      );
    }
    return this._publisherClient;
  }

  /**
   * Get the Advertiser client
   * Note: Backend middleware validates user_type - will throw error if credentials don't match
   */
  get advertiser(): AdvertiserClient {
    return this._advertiserClient;
  }

  /**
   * Get the current SDK configuration
   */
  getConfig(): Readonly<ResolvedKlinkSDKConfig> {
    return { ...this.config };
  }
}


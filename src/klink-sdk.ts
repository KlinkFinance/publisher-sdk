import { KlinkSDKConfig, ResolvedKlinkSDKConfig } from "./types/config";
import { validateConfig } from "./utils/validator";
import { Logger } from "./utils/logger";
import { HttpClient } from "./core/http-client";
import { PublisherClient } from "./core/publisher-client";
import { AdvertiserClient } from "./core/advertiser-client";

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

  constructor(config: KlinkSDKConfig) {
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
   * Resolve configuration with defaults
   */
  private resolveConfig(config: KlinkSDKConfig): ResolvedKlinkSDKConfig {
    return {
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
      baseUrl: config.baseUrl || "https://klink-quest.klink.finance",
      // baseUrl: config.baseUrl || "http://localhost:4000",
      timeoutMs: config.timeoutMs ?? 8000,
      debug: config.debug ?? false,
    };
  }

  /**
   * Get the Publisher client
   * Note: Backend middleware validates user_type - will throw error if credentials don't match
   */
  get publisher(): PublisherClient {
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


/**
 * Configuration options for initializing the Klink SDK
 */
export interface KlinkSDKConfig {
  /**
   * API key for authentication
   */
  apiKey: string;

  /**
   * API secret for request signing
   * Required for Publisher APIs, optional for Advertiser APIs
   */
  apiSecret?: string;

  /**
   * Base URL for the Klink API
   * @default "https://klink-quest.klink.finance/api"
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds
   * @default 8000
   */
  timeoutMs?: number;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

/**
 * Internal configuration with all defaults applied
 */
export interface ResolvedKlinkSDKConfig {
  apiKey: string;
  apiSecret?: string;
  baseUrl: string;
  timeoutMs: number;
  debug: boolean;
}

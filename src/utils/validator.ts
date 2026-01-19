import { KlinkSDKConfig } from "../types/config";
import { KlinkConfigError } from "../types/errors";

/**
 * Validates SDK configuration
 */
export function validateConfig(config: KlinkSDKConfig): void {
  if (!config) {
    throw new KlinkConfigError("Configuration object is required");
  }

  if (!config.apiKey || typeof config.apiKey !== "string" || config.apiKey.trim() === "") {
    throw new KlinkConfigError("'apiKey' is required and must be a non-empty string");
  }

  // apiSecret is optional - validate format if provided
  if (config.apiSecret !== undefined) {
    if (typeof config.apiSecret !== "string" || config.apiSecret.trim() === "") {
      throw new KlinkConfigError("'apiSecret' must be a non-empty string when provided");
    }
  }

  if (config.baseUrl && typeof config.baseUrl !== "string") {
    throw new KlinkConfigError("'baseUrl' must be a string");
  }

  if (config.timeoutMs !== undefined) {
    if (typeof config.timeoutMs !== "number" || config.timeoutMs <= 0) {
      throw new KlinkConfigError("'timeoutMs' must be a positive number");
    }
  }

  if (config.debug !== undefined && typeof config.debug !== "boolean") {
    throw new KlinkConfigError("'debug' must be a boolean");
  }
}

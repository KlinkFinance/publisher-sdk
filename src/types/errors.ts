/**
 * Base error class for all Klink SDK errors
 */
export class KlinkSDKError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KlinkSDKError";
    Object.setPrototypeOf(this, KlinkSDKError.prototype);
  }
}

/**
 * Error thrown when SDK configuration is invalid
 */
export class KlinkConfigError extends KlinkSDKError {
  constructor(message: string) {
    super(message);
    this.name = "KlinkConfigError";
    Object.setPrototypeOf(this, KlinkConfigError.prototype);
  }
}

/**
 * Error thrown for authentication failures
 */
export class KlinkAuthError extends KlinkSDKError {
  constructor(message: string) {
    super(message);
    this.name = "KlinkAuthError";
    Object.setPrototypeOf(this, KlinkAuthError.prototype);
  }
}

/**
 * Error thrown for API request failures
 */
export class KlinkAPIError extends KlinkSDKError {
  public statusCode?: number;
  public responseData?: unknown;

  constructor(message: string, statusCode?: number, responseData?: unknown) {
    super(message);
    this.name = "KlinkAPIError";
    this.statusCode = statusCode;
    this.responseData = responseData;
    Object.setPrototypeOf(this, KlinkAPIError.prototype);
  }
}

/**
 * Error thrown for network/timeout issues
 */
export class KlinkNetworkError extends KlinkSDKError {
  constructor(message: string) {
    super(message);
    this.name = "KlinkNetworkError";
    Object.setPrototypeOf(this, KlinkNetworkError.prototype);
  }
}

/**
 * Error thrown for validation failures
 */
export class KlinkValidationError extends KlinkSDKError {
  constructor(message: string) {
    super(message);
    this.name = "KlinkValidationError";
    Object.setPrototypeOf(this, KlinkValidationError.prototype);
  }
}

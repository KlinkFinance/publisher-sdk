/**
 * Advertiser-specific types
 */

/**
 * Parameters for sending a postback
 */
export interface SendPostbackParams {
  /**
   * Event name for the postback
   * @required
   */
  event_name: string;

  /**
   * Offer ID for the postback
   * @required
   */
  offer_id: string;

  /**
   * sub1 for the postback
   * @required
   */
  sub1: string;

  /**
   * tx_id for the postback
   * @required
   */
  tx_id: string;

  /**
   * isChargeback for the postback
   * @required
   */
  isChargeback: boolean;

  /**
   * chargebackReason for the postback
   * @required
   */
  chargebackReason: string;

  /**
   * isTest for the postback
   * @required
   */
  isTest: boolean;
}

/**
 * Response from test postback API
 */
export interface SendPostbackResponse {
  success: boolean;
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

// Placeholder types for advertiser operations
export interface AdvertiserPostback {
  // To be defined during implementation
}

export interface AdvertiserConversionEvent {
  // To be defined during implementation
}

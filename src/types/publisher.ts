/**
 * Publisher-specific types
 */

/**
 * Query parameters for fetching offers
 */
export interface GetOffersParams {
  /**
   * Page number for pagination
   * @default 1
   */
  page?: number;

  /**
   * Number of offers per page
   * @default 100
   */
  limit?: number;

  /**
   * Force reload offers (bypass cache)
   * @default false
   */
  reload?: boolean;

  /**
   * Filter by category (single value, array, JSON array, or comma-separated)
   */
  category?: string | string[];

  /**
   * Filter by device name (mobile, tablet, desktop)
   */
  device_name?: string;

  /**
   * Filter by specific offer ID
   */
  offer_id?: string;

  /**
   * Filter by offer name (search)
   */
  name?: string;

  /**
   * Filter by country code (single value, array, JSON array, or comma-separated)
   */
  country?: string | string[];

  /**
   * Filter by platform (iOS, Android, etc.)
   */
  platform?: string;

  /**
   * Sort offers by field
   */
  sort_by?: string;
}

/**
 * Publisher offer object returned from API
 */
export interface PublisherOffer {
  id: string;
  name: string;
  description?: string;
  category?: string;
  countries?: string[];
  platform?: string;
  device_type?: string;
  payout?: number;
  currency?: string;
  tracking_url?: string;
  preview_url?: string;
  image_url?: string;
  status?: string;
  [key: string]: unknown; // Allow additional fields
}

/**
 * Response from the offers API
 */
export interface GetOffersResponse {
  data: PublisherOffer[];
  message?: string;
  success: boolean;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    total_pages?: number;
  };
}

/**
 * Query parameters for fetching conversions
 */
export interface GetConversionsParams {
  /**
   * Page number for pagination
   * @default 1
   */
  page?: number;

  /**
   * Number of conversions per page
   * @default 10
   */
  limit?: number;

  /**
   * Sort conversions by field
   * Possible values: 'completedAt', 'createdAt', 'payout', 'status'
   * @default 'createdAt'
   */
  sort_by?: string;

  /**
   * Sort order
   * Possible values: 'asc', 'desc'
   */
  sort_order?: string;

  /**
   * Filter conversions from this date (YYYY-MM-DD or ISO format)
   */
  start_date?: string;

  /**
   * Filter conversions until this date (YYYY-MM-DD or ISO format)
   */
  end_date?: string;

  /**
   * Filter by conversion status
   */
  status?: string;

  /**
   * Filter by payout cycle ID
   */
  payout_cycle_id?: string;

  /**
   * Filter by specific offer ID
   */
  offer_id?: string;
}

/**
 * Publisher conversion object returned from API
 */
export interface PublisherConversion {
  id: string;
  offer_id?: string;
  offer_name?: string;
  status?: string;
  payout?: number;
  currency?: string;
  conversion_date?: string;
  payout_cycle_id?: string;
  user_id?: string;
  transaction_id?: string;
  [key: string]: unknown; // Allow additional fields
}

/**
 * Response from the conversions API
 */
export interface GetConversionsResponse {
  data: PublisherConversion[];
  message?: string;
  success: boolean;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    total_pages?: number;
  };
}

/**
 * Query parameters for fetching publisher users
 */
export interface GetUsersParams {
  /**
   * Page number for pagination
   * @default 1
   */
  page?: number;

  /**
   * Number of users per page
   * @default 10
   */
  limit?: number;

  /**
   * Filter by user status
   */
  status?: string;

  /**
   * Search users by keyword
   */
  search?: string;
}

/**
 * Publisher user object returned from API
 */
export interface PublisherUser {
  id: string;
  name?: string;
  email?: string;
  status?: string;
  created_at?: string;
  last_active?: string;
  [key: string]: unknown; // Allow additional fields
}

/**
 * Response from the users API
 */
export interface GetUsersResponse {
  data: PublisherUser[];
  message?: string;
  success: boolean;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    total_pages?: number;
  };
}

/**
 * Query parameters for fetching postbacks/logs
 */
export interface GetPostbacksParams {
  /**
   * Page number for pagination
   * @default 1
   */
  page?: number;

  /**
   * Number of postbacks per page
   * @default 10
   */
  limit?: number;

  /**
   * Sort postbacks by field
   */
  sort_by?: string;

  /**
   * Sort order (asc or desc)
   */
  sort_order?: string;

  /**
   * Filter postbacks from this date (YYYY-MM-DD or ISO format)
   */
  start_date?: string;

  /**
   * Filter postbacks until this date (YYYY-MM-DD or ISO format)
   */
  end_date?: string;

  /**
   * Filter by postback name
   */
  name?: string;

  /**
   * Filter by postback status (numeric)
   */
  status?: number;

  /**
   * Filter by specific postback ID
   */
  id?: string;
}

/**
 * Publisher postback/log object returned from API
 */
export interface PublisherPostback {
  id: string;
  name?: string;
  status?: number;
  status_text?: string;
  request_url?: string;
  response?: string;
  created_at?: string;
  processed_at?: string;
  retry_count?: number;
  [key: string]: unknown; // Allow additional fields
}

/**
 * Response from the postbacks/logs API
 */
export interface GetPostbacksResponse {
  data: PublisherPostback[];
  message?: string;
  success: boolean;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    total_pages?: number;
  };
}

/**
 * Country object
 */
export interface Country {
  code: string;
  name: string;
  [key: string]: unknown;
}

/**
 * Response from the countries API
 */
export interface GetCountriesResponse {
  success: boolean;
  data: Country[];
  message?: string;
}

/**
 * Category object
 */
export interface Category {
  id?: string;
  name: string;
  slug?: string;
  [key: string]: unknown;
}

/**
 * Response from the categories API
 */
export interface GetCategoriesResponse {
  success: boolean;
  data: Category[];
  message?: string;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: string;
  message?: string;
  timestamp?: string;
  [key: string]: unknown;
}

/**
 * Parameters for sending a postback from Publisher SDK
 */
export interface SendPublisherPostbackParams {
  /**
   * Postback parameters - any valid JSON object
   */
  params?: Record<string, any>;
}

/**
 * Response from send postback API
 */
export interface SendPublisherPostbackResponse {
  success: boolean;
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

/**
 * Parameters for creating quest redirect token
 */
export interface CreateQuestRedirectTokenParams {
  /**
   * Offer ID
   * @required
   */
  offerId: string;

  /**
   * Sub parameter (user identifier)
   * @required
   */
  sub: string;

  /**
   * Publisher ID
   * @required
   */
  pub: string;

  /**
   * Token expiration in minutes
   * @default 10
   */
  expirationMinutes?: number;

  /**
   * Custom parameters (optional)
   */
  custom_params?: {
    k1?: string;
    k2?: string;
    k3?: string;
    k4?: string;
    k5?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Response from create quest redirect token
 */
export interface CreateQuestRedirectTokenResponse {
  token: string;
  expiresAt: number;
}

/**
 * Click tracking event parameters
 */
export interface PublisherClickEvent {
  // To be defined when implementing click tracking
  [key: string]: unknown;
}

/**
 * General tracking event parameters
 */
export interface PublisherTrackEvent {
  // To be defined when implementing event tracking
  [key: string]: unknown;
}

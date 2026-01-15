/**
 * Authentication utilities for Klink API
 */

/**
 * Creates Bearer token from API key and optional secret
 * Format: apiKey:apiSecret (if secret provided) or apiKey (if secret not provided)
 * @param apiKey - API key
 * @param apiSecret - API secret (optional)
 * @returns Bearer token string (without "Bearer" prefix)
 */
export function createBearerToken(apiKey: string, apiSecret?: string): string {
  if (apiSecret) {
    return `${apiKey}:${apiSecret}`;
  }
  return apiKey;
}

/**
 * Creates authentication headers for API requests
 * Uses Bearer token authentication
 * - Publisher: Bearer apiKey:apiSecret (apiSecret required)
 * - Advertiser: Bearer apiKey (apiSecret optional)
 * @param apiKey - API key
 * @param apiSecret - API secret (optional)
 * @returns Authentication headers
 */
export function createAuthHeaders(
  apiKey: string,
  apiSecret?: string
): Record<string, string> {
  const token = createBearerToken(apiKey, apiSecret);
  
  return {
    Authorization: `Bearer ${token}`,
  };
}


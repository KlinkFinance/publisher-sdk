/**
 * Authentication utilities for Klink API
 */

/**
 * Creates Bearer token from API key and secret
 * Format: apiKey:apiSecret
 * @param apiKey - API key
 * @param apiSecret - API secret
 * @returns Bearer token string (without "Bearer" prefix)
 */
export function createBearerToken(apiKey: string, apiSecret: string): string {
  return `${apiKey}:${apiSecret}`;
}

/**
 * Creates authentication headers for API requests
 * Uses Bearer token authentication with format: Bearer apiKey:apiSecret
 * @param apiKey - API key
 * @param apiSecret - API secret
 * @returns Authentication headers
 */
export function createAuthHeaders(
  apiKey: string,
  apiSecret: string
): Record<string, string> {
  const token = createBearerToken(apiKey, apiSecret);
  
  return {
    Authorization: `Bearer ${token}`,
  };
}


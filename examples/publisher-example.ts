/**
 * Example: Publisher Usage
 * 
 * This example demonstrates how to initialize and use the SDK for Publisher APIs.
 * 
 * IMPORTANT: 
 * - apiSecret is REQUIRED for Publisher APIs
 * - Use KlinkSDK.create() factory method for initialization with health check
 * - SDK will only initialize if health check returns status 200
 * 
 * Note: Backend middleware validates user_type based on API credentials.
 */

import { KlinkSDK } from "../src";

// Initialize SDK for Publisher using factory method
// This performs a health check before initializing - SDK only created if API is healthy (status 200)
async function initializeSDK() {
  const client = await KlinkSDK.create({
    apiKey: process.env.KLINK_API_KEY || "your-api-key",
    apiSecret: process.env.KLINK_API_SECRET || "your-api-secret", // Required!
    baseUrl: "https://klink-quest.klink.finance", // Optional: defaults to this
    timeoutMs: 8000, // Optional: defaults to 8000ms
    debug: true, // Optional: enable debug logging
  });

  // Access the publisher client
  // Will throw error if apiSecret is not provided
  const publisher = client.publisher;

  console.log("SDK initialized successfully!");
  return { client, publisher };
}

// Initialize SDK (async)
const { client, publisher } = await initializeSDK();

// ============================================================================
// Example 1: Fetch Offers
// ============================================================================

async function fetchAllOffers() {
  try {
    const response = await publisher.getOffers();
    console.log("Fetched offers:", response.data.length);
    console.log("Success:", response.success);
    console.log("Message:", response.message);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchFilteredOffers() {
  try {
    const response = await publisher.getOffers({
      page: 1,
      limit: 50,
      category: ["gaming", "finance"], // Multiple categories
      country: "US", // Single country
      device_name: "iphone_ipad", // possible values: web, android, iphone_ipad
      reload: false,
    });
    console.log("Filtered offers:", response.data.length);
    response.data.forEach((offer) => {
      console.log(`- ${offer.name} (${offer.id})`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function searchOffers() {
  try {
    const response = await publisher.getOffers({
      name: "reward",
      limit: 20,
    });
    console.log("Search results:", response.data.length);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getOffersMultipleCountries() {
  try {
    const response = await publisher.getOffers({
      country: ["US", "GB", "CA"], // Multiple countries
      sort_by: "payout",
    });
    console.log("Offers for multiple countries:", response.data.length);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getSpecificOffer() {
  try {
    const response = await publisher.getOffers({
      offer_id: "specific-offer-id",
    });
    console.log("Specific offer:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================================================================
// Example 2: Fetch Conversions
// ============================================================================

async function fetchAllConversions() {
  try {
    const response = await publisher.getConversions({
      page: 1,
      limit: 20,
    });
    console.log("Fetched conversions:", response.data.length);
    console.log("Success:", response.success);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchConversionsWithDateRange() {
  try {
    const response = await publisher.getConversions({
      page: 1,
      limit: 50,
      start_date: "2024-01-01",
      end_date: "2024-12-31",
      sort_by: "completedAt",
      sort_order: "desc",
    });
    console.log("Conversions in date range:", response.data.length);
    response.data.forEach((conv) => {
      console.log(`- Conversion ID: ${conv.id}, Status: ${conv.status}, Payout: ${conv.payout}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchConversionsByStatus() {
  try {
    const response = await publisher.getConversions({
      status: "approved",
      sort_by: "payout",
      sort_order: "desc",
    });
    console.log("Approved conversions:", response.data.length);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchConversionsByOffer() {
  try {
    const response = await publisher.getConversions({
      offer_id: "specific-offer-id",
      page: 1,
      limit: 10,
    });
    console.log("Conversions for offer:", response.data.length);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchConversionsByPayoutCycle() {
  try {
    const response = await publisher.getConversions({
      payout_cycle_id: "payout-cycle-id",
      page: 1,
      limit: 100,
    });
    console.log("Conversions in payout cycle:", response.data.length);
  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================================================================
// Example 3: Fetch Users
// ============================================================================

async function fetchAllUsers() {
  try {
    const response = await publisher.getUsers({
      page: 1,
      limit: 20,
    });
    console.log("Fetched users:", response.data.length);
    console.log("Success:", response.success);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchUsersByStatus() {
  try {
    const response = await publisher.getUsers({
      status: "active",
      page: 1,
      limit: 50,
    });
    console.log("Active users:", response.data.length);
    response.data.forEach((user) => {
      console.log(`- User ID: ${user.id}, Status: ${user.status}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function searchUsers() {
  try {
    const response = await publisher.getUsers({
      search: "john",
      page: 1,
      limit: 10,
    });
    console.log("Search results:", response.data.length);
  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================================================================
// Example 4: Fetch Postbacks
// ============================================================================

async function fetchAllPostbacks() {
  try {
    const response = await publisher.getPostbacks({
      page: 1,
      limit: 20,
    });
    console.log("Fetched postbacks:", response.data.length);
    console.log("Success:", response.success);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchPostbacksWithDateRange() {
  try {
    const response = await publisher.getPostbacks({
      page: 1,
      limit: 50,
      start_date: "2024-01-01",
      end_date: "2024-12-31",
      sort_by: "created_at",
      sort_order: "desc",
    });
    console.log("Postbacks in date range:", response.data.length);
    response.data.forEach((postback) => {
      console.log(`- Postback ID: ${postback.id}, Status: ${postback.status}, Created: ${postback.created_at}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchPostbacksByStatus() {
  try {
    const response = await publisher.getPostbacks({
      status: 200, // HTTP status code
      page: 1,
      limit: 100,
    });
    console.log("Successful postbacks (200):", response.data.length);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchPostbacksByName() {
  try {
    const response = await publisher.getPostbacks({
      name: "conversion_postback",
      page: 1,
      limit: 20,
    });
    console.log("Postbacks by name:", response.data.length);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchSpecificPostback() {
  try {
    const response = await publisher.getPostbacks({
      id: "postback-id-here",
    });
    console.log("Specific postback:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================================================================
// Example 5: Fetch Countries
// ============================================================================

async function fetchCountries() {
  try {
    const response = await publisher.getCountries();
    console.log("Fetched countries:", response.data.length);
    console.log("Success:", response.success);
    
    if (response.data.length > 0) {
      console.log("Sample countries:");
      response.data.slice(0, 10).forEach((country) => {
        console.log(`- ${country.name} (${country.code})`);
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchCountriesWithReload() {
  try {
    const response = await publisher.getCountries(true); // Force reload
    console.log("Fetched countries (reloaded):", response.data.length);
  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================================================================
// Example 6: Fetch Categories
// ============================================================================

async function fetchCategories() {
  try {
    const response = await publisher.getCategories();
    console.log("Fetched categories:", response.data.length);
    console.log("Success:", response.success);
    
    if (response.data.length > 0) {
      console.log("Sample categories:");
      response.data.slice(0, 10).forEach((category) => {
        console.log(`- ${category.name}${category.slug ? ` (${category.slug})` : ''}`);
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchCategoriesWithReload() {
  try {
    const response = await publisher.getCategories(true); // Force reload
    console.log("Fetched categories (reloaded):", response.data.length);
  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================================================================
// Example 7: Health Check
// ============================================================================

async function checkHealth() {
  try {
    const health = await publisher.healthCheck();
    console.log("API Health Status:", health.status);
    console.log("Message:", health.message);
    if (health.timestamp) {
      console.log("Timestamp:", health.timestamp);
    }
  } catch (error) {
    console.error("Health check failed:", error);
  }
}

// ============================================================================
// Example 8: Send Postback
// ============================================================================

/**
 * Send postback with template variables
 * Template variables will be replaced by the API with actual values:
 * {{conversionId}}, {{offerId}}, {{offerName}}, {{userId}}, {{eventType}},
 * {{payout}}, {{status}}, {{reversedConversionId}}, {{k1}}, {{k2}}, {{k3}}
 */
async function sendPostback() {
  try {
    const response = await publisher.sendTestPostback({
      params: {
        eventType: "{{eventType}}",
        offerId: "{{offerId}}",
        userId: "{{userId}}",
        conversionId: "{{conversionId}}",
        payout: "{{payout}}",
        status: "{{status}}",
        reversedConversionId: "{{reversedConversionId}}",
        k1: "{{k1}}",
        k2: "{{k2}}",
        k3: "{{k3}}",
      },
    });
    console.log("Postback sent successfully:", response.success);
    console.log("Message:", response.message);
    console.log("Data:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function sendPostbackWithCustomParams() {
  try {
    const response = await publisher.sendTestPostback({
      params: {
        eventName: "purchase",
        offerId: "{{offerId}}",
        offerName: "{{offerName}}",
        userId: "{{userId}}",
        conversionId: "{{conversionId}}",
        payout: "{{payout}}",
        status: "{{status}}",
        reversedConversionId: "{{reversedConversionId}}",
        k1: "{{k1}}",
        k2: "{{k2}}",
        k3: "{{k3}}",
      },
    });
    console.log("Postback sent:", response.success);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function sendPostbackWithMixedParams() {
  try {
    const response = await publisher.sendTestPostback({
      params: {
        // Template variables
        offer_id: "{{offerId}}",
        user_id: "{{userId}}",
        conversion_id: "{{conversionId}}",
        // Static values
        api_key: "your_api_key",
        timestamp: new Date().toISOString(),
        // Custom template variables
        custom_param: "{{k1}}",
      },
    });
    console.log("Postback sent (mixed params):", response.success);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function sendPostbackWithEmptyParams() {
  try {
    const response = await publisher.sendTestPostback({
      params: {},
    });
    console.log("Postback sent (empty params):", response.success);
  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================================================================
// Run Examples (uncomment to test)
// ============================================================================

// Offers
// fetchAllOffers();
// fetchFilteredOffers();
// searchOffers();
// getOffersMultipleCountries();
// getSpecificOffer();

// Conversions
// fetchAllConversions();
// fetchConversionsWithDateRange();
// fetchConversionsByStatus();
// fetchConversionsByOffer();
// fetchConversionsByPayoutCycle();

// Users
// fetchAllUsers();
// fetchUsersByStatus();
// searchUsers();

// Postbacks
// fetchAllPostbacks();
// fetchPostbacksWithDateRange();
// fetchPostbacksByStatus();
// fetchPostbacksByName();
// fetchSpecificPostback();

// Countries
// fetchCountries();
// fetchCountriesWithReload();

// Categories
// fetchCategories();
// fetchCategoriesWithReload();

// Health Check
// checkHealth();

// Send Postback
// sendPostback();
// sendPostbackWithCustomParams();
// sendPostbackWithMixedParams();
// sendPostbackWithEmptyParams();
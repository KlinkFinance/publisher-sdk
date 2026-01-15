/**
 * Example: Error Handling
 * 
 * This example demonstrates how to handle different types of errors from the SDK.
 */

import {
  KlinkSDK,
  KlinkConfigError,
  KlinkAuthError,
  KlinkAPIError,
  KlinkNetworkError,
  KlinkValidationError,
} from "../src";

// Example 1: Configuration Error
try {
  const client = await KlinkSDK.create({
    apiKey: "", // Empty API key
    apiSecret: "test",
  });
} catch (error) {
  if (error instanceof KlinkConfigError) {
    console.error("Configuration Error:", error.message);
  }
}

// Example 2: Proper Error Handling in API Calls
async function makeAPICall() {
  try {
    // Publisher example (apiSecret required)
    const publisherClient = await KlinkSDK.create({
      apiKey: process.env.KLINK_API_KEY || "your-api-key",
      apiSecret: process.env.KLINK_API_SECRET || "your-api-secret", // Required for Publisher
    });

    const publisher = publisherClient.publisher;
    // await publisher.getOffers();

    // Advertiser example (apiSecret optional)
    const advertiserClient = await KlinkSDK.create({
      apiKey: process.env.KLINK_API_KEY || "your-api-key",
      // apiSecret: process.env.KLINK_API_SECRET, // Optional for Advertiser
    });

    const advertiser = advertiserClient.advertiser;
    // await advertiser.sendPostback({...});

    // Note: Backend middleware validates user_type - will throw error if credentials don't match
  } catch (error) {
    if (error instanceof KlinkAuthError) {
      console.error("Authentication failed. Please check your API credentials.");
      console.error("Details:", error.message);
    } else if (error instanceof KlinkAPIError) {
      console.error("API Error:", error.message);
      console.error("Status Code:", error.statusCode);
      console.error("Response Data:", error.responseData);
    } else if (error instanceof KlinkNetworkError) {
      console.error("Network error. Please check your internet connection.");
      console.error("Details:", error.message);
    } else if (error instanceof KlinkValidationError) {
      console.error("Validation error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

// Uncomment to run
// makeAPICall();


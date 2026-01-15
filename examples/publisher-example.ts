/**
 * Example: Publisher Usage
 * 
 * This example demonstrates how to initialize and use the SDK for Publisher APIs.
 * Note: Backend middleware validates user_type based on API credentials.
 */

import { KlinkSDK } from "../src";

// Initialize SDK
const client = new KlinkSDK({
  apiKey: process.env.KLINK_API_KEY || "your-api-key",
  apiSecret: process.env.KLINK_API_SECRET || "your-api-secret",
  baseUrl: "https://api.klinkfinance.com", // Optional: defaults to this
  timeoutMs: 8000, // Optional: defaults to 8000ms
  debug: true, // Optional: enable debug logging
});

// Access the publisher client
// Backend will validate that credentials match publisher user_type
const publisher = client.publisher;

console.log("SDK initialized successfully!");

// Example 1: Fetch all offers with default pagination
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

// Example 2: Fetch offers with filters
async function fetchFilteredOffers() {
  try {
    const response = await publisher.getOffers({
      page: 1,
      limit: 50,
      category: ["gaming", "finance"], // Multiple categories
      country: "US", // Single country
      device_name: "mobile",
      platform: "iOS",
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

// Example 3: Search offers by name
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

// Example 4: Get offers for multiple countries
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

// Run examples (uncomment to test)
// fetchAllOffers();
// fetchFilteredOffers();
// searchOffers();
// getOffersMultipleCountries();


/**
 * Example: Advertiser Usage
 * 
 * This example demonstrates how to initialize and use the SDK for Advertiser APIs.
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

// Access the advertiser client
// Backend will validate that credentials match advertiser user_type
const advertiser = client.advertiser;

console.log("SDK initialized successfully!");

// Example: Send postback (to be implemented)
async function sendPostback() {
  try {
    // await advertiser.sendPostback({
    //   transactionId: "tx_123",
    //   amount: 100,
    //   currency: "USD",
    // });
    // console.log("Postback sent successfully");
    console.log("Advertiser methods will be implemented after architecture approval");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Uncomment to run
// sendPostback();


/**
 * Example: Advertiser Usage
 * 
 * This example demonstrates how to initialize and use the SDK for Advertiser APIs.
 * 
 * IMPORTANT: 
 * - apiSecret is OPTIONAL for Advertiser APIs
 * - Use KlinkSDK.create() factory method for initialization with health check
 * - SDK will only initialize if health check returns status 200
 * 
 * Note: Backend middleware validates user_type based on API credentials.
 */

import { KlinkSDK } from "../src";

// Initialize SDK for Advertiser using factory method
// This performs a health check before initializing - SDK only created if API is healthy (status 200)
async function initializeSDK() {
  const client = await KlinkSDK.create({
    apiKey: process.env.KLINK_API_KEY || "your-api-key",
    baseUrl: "https://klink-quest.klink.finance", // Optional: defaults to this
    timeoutMs: 8000, // Optional: defaults to 8000ms
    debug: true, // Optional: enable debug logging
  });

  // Access the advertiser client
  // Works with or without apiSecret
  const advertiser = client.advertiser;

  console.log("SDK initialized successfully!");
  return { client, advertiser };
}

// Initialize SDK (async)
const { client, advertiser } = await initializeSDK();

// ============================================================================
// Example 1: Health Check
// ============================================================================

async function checkHealth() {
  try {
    const health = await advertiser.healthCheck();
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
// Example 2: Send Postback
// ============================================================================

async function sendConversionPostback() {
  try {
    const response = await advertiser.sendPostback({
      event_name: "conversion",
      offer_id: "klink_Splinterlands_ios",
      sub1: "user_12345",
      tx_id: "transaction_abc123",
      isChargeback: false,
      chargebackReason: "",
      isTest: false, // Production postback
    });
    console.log("Conversion postback sent:", response.success);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Chargeback postback means reversal postback
async function sendChargebackPostback() {
  try {
    const response = await advertiser.sendPostback({
      event_name: "chargeback",
      offer_id: "offer_123",
      sub1: "user_12345",
      tx_id: "transaction_abc123",
      isChargeback: true,
      chargebackReason: "Fraudulent transaction",
      isTest: false,
    });
    console.log("Chargeback postback sent:", response.success);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function sendTestPostback() {
  try {
    const response = await advertiser.sendPostback({
      event_name: "create_account",
      offer_id: "test_offer",
      sub1: "test_sub1",
      tx_id: "test_tx_" + Date.now(),
      isChargeback: false,
      chargebackReason: "",
      isTest: true, // Test mode
    });
    console.log("Test postback sent:", response.success);
    console.log("Response:", response);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function sendPostbackWithEmptyChargebackReason() {
  try {
    const response = await advertiser.sendPostback({
      event_name: "conversion",
      offer_id: "offer_123",
      sub1: "sub1_value",
      tx_id: "tx_123",
      isChargeback: false,
      chargebackReason: "", // Empty string when not a chargeback
      isTest: true,
    });
    console.log("Postback sent (no chargeback):", response.success);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function sendPostbackWithDifferentEventNames() {
  try {
    // Example: Account creation event
    const accountResponse = await advertiser.sendPostback({
      event_name: "create_account",
      offer_id: "offer_123",
      sub1: "user_123",
      tx_id: "tx_account_123",
      isChargeback: false,
      chargebackReason: "",
      isTest: true,
    });
    console.log("Account creation postback:", accountResponse.success);

    // Example: Purchase event
    const purchaseResponse = await advertiser.sendPostback({
      event_name: "purchase",
      offer_id: "offer_123",
      sub1: "user_123",
      tx_id: "tx_purchase_123",
      isChargeback: false,
      chargebackReason: "",
      isTest: true,
    });
    console.log("Purchase postback:", purchaseResponse.success);

    // Example: Subscription event
    const subscriptionResponse = await advertiser.sendPostback({
      event_name: "subscription",
      offer_id: "offer_123",
      sub1: "user_123",
      tx_id: "tx_subscription_123",
      isChargeback: false,
      chargebackReason: "",
      isTest: true,
    });
    console.log("Subscription postback:", subscriptionResponse.success);
  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================================================================
// Run Examples (uncomment to test)
// ============================================================================

// Health Check
// checkHealth();

// Postbacks
// sendConversionPostback();
// sendChargebackPostback();
// sendTestPostback();
// sendPostbackWithEmptyChargebackReason();
// sendPostbackWithDifferentEventNames();


/**
 * @klink/sdk - Official Node.js SDK for Klink API
 *
 * Supports both Publisher and Advertiser modes for seamless integration
 * with the Klink platform.
 */

// Main SDK class
export { KlinkSDK } from "./klink-sdk";

// Export all types
export * from "./types";

// Export clients for advanced usage
export { PublisherClient, AdvertiserClient } from "./core";

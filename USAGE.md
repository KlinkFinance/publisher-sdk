# API Usage Guide

This guide provides detailed examples of using the Klink SDK.

## Table of Contents

- [Publisher API](#publisher-api)
  - [Fetching Offers](#fetching-offers)
  - [Query Parameters](#query-parameters)
- [Advertiser API](#advertiser-api)
- [Error Handling](#error-handling)

## Publisher API

### Fetching Offers

The `getOffers()` method fetches available offers for publishers with optional filtering.

#### Basic Usage

```typescript
import { KlinkSDK } from "@klink/sdk";

// Publisher requires apiSecret
// Use factory method - performs health check before initialization
const client = await KlinkSDK.create({
  apiKey: process.env.KLINK_API_KEY!,
  apiSecret: process.env.KLINK_API_SECRET!, // Required for Publisher
});

// Access publisher client - backend validates user_type
const publisher = client.publisher;

// Fetch all offers with default pagination
const response = await publisher.getOffers();
console.log(`Fetched ${response.data.length} offers`);
```

#### With Pagination

```typescript
const response = await publisher.getOffers({
  page: 1,
  limit: 50,
});
```

#### Filter by Category

```typescript
// Single category
const response = await publisher.getOffers({
  category: "gaming",
});

// Multiple categories
const response = await publisher.getOffers({
  category: ["gaming", "finance", "shopping"],
});
```

#### Filter by Country

```typescript
// Single country
const response = await publisher.getOffers({
  country: "US",
});

// Multiple countries
const response = await publisher.getOffers({
  country: ["US", "GB", "CA"],
});
```

#### Filter by Device Type

```typescript
const response = await publisher.getOffers({
  device_name: "mobile", // 'mobile', 'tablet', or 'desktop'
});
```

#### Filter by Platform

```typescript
const response = await publisher.getOffers({
  platform: "iOS", // 'iOS', 'Android', etc.
});
```

#### Search by Name

```typescript
const response = await publisher.getOffers({
  name: "reward", // Search keyword
});
```

#### Get Specific Offer

```typescript
const response = await publisher.getOffers({
  offer_id: "offer_123",
});
```

#### Combined Filters

```typescript
const response = await publisher.getOffers({
  page: 1,
  limit: 100,
  category: ["gaming", "finance"],
  country: ["US", "GB"],
  device_name: "mobile",
  platform: "iOS",
  reload: true, // Force reload (bypass cache)
  sort_by: "payout", // Sort by field
});
```

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | `number` | `1` | Page number for pagination |
| `limit` | `number` | `100` | Number of offers per page |
| `reload` | `boolean` | `false` | Force reload (bypass cache) |
| `category` | `string \| string[]` | - | Filter by category |
| `device_name` | `string` | - | Filter by device type (mobile, tablet, desktop) |
| `offer_id` | `string` | - | Get specific offer by ID |
| `name` | `string` | - | Search offers by name |
| `country` | `string \| string[]` | - | Filter by country code(s) |
| `platform` | `string` | - | Filter by platform (iOS, Android, etc.) |
| `sort_by` | `string` | - | Sort offers by field |

### Response Format

```typescript
{
  data: PublisherOffer[];  // Array of offer objects
  message?: string;        // Optional message
  success: boolean;        // Request success status
  meta?: {                 // Optional metadata
    page?: number;
    limit?: number;
    total?: number;
    total_pages?: number;
  };
}
```

### Offer Object Structure

```typescript
{
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
  // ... additional fields
}
```

#### Send Postback

Send a postback from Publisher SDK with any valid JSON parameters. You can use template variables that will be replaced by the API with actual values.

**Available Template Variables:**

| Variable | Description |
|----------|-------------|
| `{{conversionId}}` | Conversion ID |
| `{{offerId}}` | Offer ID |
| `{{offerName}}` | Offer name |
| `{{userId}}` | User ID |
| `{{eventType}}` | Event type |
| `{{payout}}` | Payout amount |
| `{{status}}` | Conversion status |
| `{{reversedConversionId}}` | Reversed conversion ID |
| `{{k1}}` | Custom parameter k1 |
| `{{k2}}` | Custom parameter k2 |
| `{{k3}}` | Custom parameter k3 |

```typescript
// Basic usage with template variables
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

console.log("Success:", response.success);
console.log("Message:", response.message);
console.log("Data:", response.data);
```

**With Custom Parameters:**

```typescript
const response = await publisher.sendTestPostback({
  params: {
    event_name: "purchase",
    offer_id: "{{offerId}}",
    offer_name: "{{offerName}}",
    user_id: "{{userId}}",
    conversion_id: "{{conversionId}}",
    payout: "{{payout}}",
    status: "{{status}}",
    custom_field_1: "{{k1}}",
    custom_field_2: "{{k2}}",
    // Any other custom fields or template variables
  },
});
```

**Note**: The `params` object accepts any valid JSON structure. Template variables (e.g., `{{conversionId}}`, `{{offerId}}`) will be replaced by the API with actual values when the postback is sent.

## Advertiser API

Advertiser API methods are available through the advertiser client.

```typescript
// Use factory method - performs health check before initialization
const client = await KlinkSDK.create({
  apiKey: process.env.KLINK_API_KEY!,
  // apiSecret: process.env.KLINK_API_SECRET!, // Optional for Advertiser
});

// Access advertiser client - backend validates user_type
const advertiser = client.advertiser;

// Send postback
await advertiser.sendPostback({
  event_name: "create_account",
  offer_id: "offer_123",
  sub1: "sub1_value",
  tx_id: "tx_123",
  isChargeback: false,
  chargebackReason: "",
  isTest: true,
});
```

## Error Handling

### Error Types

The SDK provides specific error types for different scenarios:

```typescript
import {
  KlinkSDK,
  KlinkConfigError,
  KlinkAuthError,
  KlinkAPIError,
  KlinkNetworkError,
} from "@klink/sdk";
```

### Handling Errors

```typescript
try {
  const response = await publisher.getOffers();
  console.log("Offers:", response.data);
} catch (error) {
  if (error instanceof KlinkAuthError) {
    console.error("Authentication failed:", error.message);
    // Check your API credentials
  } else if (error instanceof KlinkAPIError) {
    console.error("API error:", error.message);
    console.error("Status code:", error.statusCode);
    console.error("Response data:", error.responseData);
  } else if (error instanceof KlinkNetworkError) {
    console.error("Network error:", error.message);
    // Check internet connection or API availability
  } else {
    console.error("Unexpected error:", error);
  }
}
```

### Common Error Scenarios

#### Authentication Error (401/403)

```typescript
// Thrown when API key/secret is invalid
KlinkAuthError: "Authentication failed: Invalid credentials"
```

**Solution**: Verify your API key and secret are correct.

#### API Error (4xx/5xx)

```typescript
// Thrown for API-level errors
KlinkAPIError: "API request failed with status 400"
```

**Solution**: Check the `statusCode` and `responseData` for details.

#### Network Error

```typescript
// Thrown for network/timeout issues
KlinkNetworkError: "Network error: timeout of 8000ms exceeded"
```

**Solution**: Check internet connection, API availability, or increase `timeoutMs`.

## Advanced Usage

### Custom Timeout

```typescript
// Publisher example (apiSecret required)
// Use factory method - performs health check before initialization
const publisherClient = await KlinkSDK.create({
  apiKey: process.env.KLINK_API_KEY!,
  apiSecret: process.env.KLINK_API_SECRET!, // Required for Publisher
  timeoutMs: 15000, // 15 seconds
});

// Advertiser example (apiSecret optional)
const advertiserClient = await KlinkSDK.create({
  apiKey: process.env.KLINK_API_KEY!,
  // apiSecret: process.env.KLINK_API_SECRET!, // Optional
  timeoutMs: 15000, // 15 seconds
});
```

### Debug Mode

```typescript
// Publisher example
// Use factory method - performs health check before initialization
const publisherClient = await KlinkSDK.create({
  apiKey: process.env.KLINK_API_KEY!,
  apiSecret: process.env.KLINK_API_SECRET!, // Required
  debug: true, // Enable detailed logging
});

// Advertiser example
const advertiserClient = await KlinkSDK.create({
  apiKey: process.env.KLINK_API_KEY!,
  debug: true, // Enable detailed logging
});
```

### Custom Base URL

```typescript
// Publisher example
// Use factory method - performs health check before initialization
const publisherClient = await KlinkSDK.create({
  apiKey: process.env.KLINK_API_KEY!,
  apiSecret: process.env.KLINK_API_SECRET!, // Required
  baseUrl: "https://klink-quest.klink.finance",
});

// Advertiser example
const advertiserClient = await KlinkSDK.create({
  apiKey: process.env.KLINK_API_KEY!,
  baseUrl: "https://klink-quest.klink.finance",
});
```

## Tips & Best Practices

1. **Environment Variables**: Always use environment variables for API credentials
   ```typescript
   apiKey: process.env.KLINK_API_KEY!,
   apiSecret: process.env.KLINK_API_SECRET!,
   ```

2. **Error Handling**: Always wrap API calls in try-catch blocks

3. **Pagination**: Use pagination for large result sets
   ```typescript
   const response = await publisher.getOffers({ page: 1, limit: 50 });
   ```

4. **Caching**: Use `reload: false` (default) to leverage caching, or `reload: true` to force fresh data

5. **Filtering**: Combine filters to get precisely what you need
   ```typescript
   const response = await publisher.getOffers({
     category: ["gaming"],
     country: "US",
     device_name: "mobile",
     limit: 20,
   });
   ```

6. **Debug Mode**: Enable debug mode during development for detailed logs
   ```typescript
   debug: true
   ```

## Support

For issues or questions:
- Check the [README.md](./README.md) for basic setup
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- Contact Klink support team



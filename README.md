# @klink/sdk

Official Node.js SDK for the Klink platform. This SDK provides a simple and consistent interface for both Publishers and Advertisers to integrate with Klink's API.

## Features

- 🚀 Easy to use - Simple initialization and intuitive API
- 🔐 Built-in authentication - Automatic request signing and auth headers
- 🔄 Retry logic - Automatic retries for failed requests (coming soon)
- 📝 TypeScript support - Full type definitions included
- 📦 Dual module support - Works with both CommonJS and ESM
- 🐛 Debug mode - Detailed logging for troubleshooting
- ⚡ Lightweight - Minimal dependencies

## Installation

```bash
npm install @klink/sdk
```

or with yarn:

```bash
yarn add @klink/sdk
```

or with pnpm:

```bash
pnpm add @klink/sdk
```

## Requirements

- Node.js >= 16.0.0

## Quick Start

### Basic Usage

```typescript
import { KlinkSDK } from "@klink/sdk";

// Initialize SDK - both publisher and advertiser clients are available
const client = new KlinkSDK({
  apiKey: "your-api-key",
  apiSecret: "your-api-secret",
});

// Use the publisher client (backend validates user_type)
const publisher = client.publisher;

// Fetch offers
const response = await publisher.getOffers({
  page: 1,
  limit: 50,
  category: ["gaming", "finance"],
  country: "US",
  device_name: "mobile",
});

console.log(`Fetched ${response.data.length} offers`);

// Use the advertiser client (backend validates user_type)
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

**Note**: The backend middleware validates `user_type` based on your API credentials. If you try to use publisher APIs with advertiser credentials (or vice versa), the backend will return an authentication error.

## Configuration Options

```typescript
interface KlinkSDKConfig {
  /**
   * API key for authentication
   * @required
   */
  apiKey: string;

  /**
   * API secret for request signing
   * @required
   */
  apiSecret: string;

  /**
   * Base URL for the Klink API
   * @default "https://klink-quest.klink.finance/api"
   * @optional
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds
   * @default 8000
   * @optional
   */
  timeoutMs?: number;

  /**
   * Enable debug logging
   * @default false
   * @optional
   */
  debug?: boolean;
}
```

**Note**: Both `publisher` and `advertiser` clients are available after initialization. The backend middleware validates `user_type` based on your API credentials, so using the wrong client will result in authentication errors.

## Usage Examples

### Basic Initialization

```typescript
import { KlinkSDK } from "@klink/sdk";

const client = new KlinkSDK({
  apiKey: process.env.KLINK_API_KEY,
  apiSecret: process.env.KLINK_API_SECRET,
});

// Both clients are available - backend validates user_type
const publisher = client.publisher;
const advertiser = client.advertiser;
```

### With Custom Configuration

```typescript
import { KlinkSDK } from "@klink/sdk";

const client = new KlinkSDK({
  apiKey: process.env.KLINK_API_KEY,
  apiSecret: process.env.KLINK_API_SECRET,
  baseUrl: "https://staging-api.klinkfinance.com", // Use staging environment
  timeoutMs: 10000, // 10 second timeout
  debug: true, // Enable debug logging
});
```

### Environment Variables

It's recommended to use environment variables for sensitive data:

```bash
# .env file
KLINK_API_KEY=your-api-key
KLINK_API_SECRET=your-api-secret
```

```typescript
import { KlinkSDK } from "@klink/sdk";

const client = new KlinkSDK({
  apiKey: process.env.KLINK_API_KEY!,
  apiSecret: process.env.KLINK_API_SECRET!,
});
```

## Error Handling

The SDK provides custom error classes for different error scenarios:

```typescript
import { 
  KlinkSDK, 
  KlinkConfigError, 
  KlinkAuthError, 
  KlinkAPIError, 
  KlinkNetworkError 
} from "@klink/sdk";

try {
  const client = new KlinkSDK({
    apiKey: "invalid-key",
    apiSecret: "invalid-secret",
  });
  
  // Make API calls...
} catch (error) {
  if (error instanceof KlinkConfigError) {
    console.error("Configuration error:", error.message);
  } else if (error instanceof KlinkAuthError) {
    console.error("Authentication failed:", error.message);
  } else if (error instanceof KlinkAPIError) {
    console.error("API error:", error.message, error.statusCode);
  } else if (error instanceof KlinkNetworkError) {
    console.error("Network error:", error.message);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## API Methods

### Publisher Client

```typescript
const publisher = client.publisher;

// 1. Fetch offers with filters
const offersResponse = await publisher.getOffers({
  page: 1,
  limit: 100,
  category: ["gaming", "finance"],
  country: ["US", "GB"],
  device_name: "mobile",
  platform: "iOS",
  reload: false,
  sort_by: "payout",
});

console.log(offersResponse.data);      // Array of offers
console.log(offersResponse.success);   // Request status

// 2. Fetch conversions with filters
const conversionsResponse = await publisher.getConversions({
  page: 1,
  limit: 20,
  start_date: "2024-01-01",
  end_date: "2024-12-31",
  status: "approved",
  offer_id: "offer_123",
  sort_by: "completedAt",
  sort_order: "desc",
});

console.log(conversionsResponse.data);      // Array of conversions
console.log(conversionsResponse.success);   // Request status

// 3. Fetch publisher users
const usersResponse = await publisher.getUsers({
  page: 1,
  limit: 20,
  status: "active",
  search: "john",
});

console.log(usersResponse.data);      // Array of users
console.log(usersResponse.success);   // Request status

// 4. Fetch postback logs
const postbacksResponse = await publisher.getPostbacks({
  page: 1,
  limit: 20,
  start_date: "2024-01-01",
  end_date: "2024-12-31",
  status: 200,
  name: "conversion_postback",
  sort_by: "created_at",
  sort_order: "desc",
});

console.log(postbacksResponse.data);      // Array of postback logs
console.log(postbacksResponse.success);   // Request status

// 5. Fetch supported countries
const countriesResponse = await publisher.getCountries();
// or with reload
const countriesResponse = await publisher.getCountries(true);

console.log(countriesResponse.data);      // Array of countries
console.log(countriesResponse.success);   // Request status

// 6. Fetch supported categories
const categoriesResponse = await publisher.getCategories();
// or with reload
const categoriesResponse = await publisher.getCategories(true);

console.log(categoriesResponse.data);      // Array of categories
console.log(categoriesResponse.success);   // Request status

// 7. Health check
const health = await publisher.healthCheck();
console.log(health.status);           // API health status

// Other methods (coming soon):
// - trackClick()
// - trackEvent()
```

#### getOffers() Parameters

All parameters are optional:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | `number` | `1` | Page number for pagination |
| `limit` | `number` | `100` | Number of offers per page |
| `reload` | `boolean` | `false` | Force reload (bypass cache) |
| `category` | `string \| string[]` | - | Filter by category |
| `device_name` | `string` | - | Filter by device (mobile, tablet, desktop) |
| `offer_id` | `string` | - | Get specific offer by ID |
| `name` | `string` | - | Search offers by name |
| `country` | `string \| string[]` | - | Filter by country code(s) |
| `platform` | `string` | - | Filter by platform (iOS, Android) |
| `sort_by` | `string` | - | Sort offers by field |

#### getConversions() Parameters

All parameters are optional:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | `number` | `1` | Page number for pagination |
| `limit` | `number` | `10` | Number of conversions per page |
| `sort_by` | `string` | `createdAt` | Sort conversions by field (completedAt, createdAt, payout, status) |
| `sort_order` | `string` | - | Sort order (asc or desc) |
| `start_date` | `string` | - | Filter from date (YYYY-MM-DD) |
| `end_date` | `string` | - | Filter until date (YYYY-MM-DD) |
| `status` | `string` | - | Filter by conversion status |
| `payout_cycle_id` | `string` | - | Filter by payout cycle ID |
| `offer_id` | `string` | - | Filter by specific offer ID |

#### getUsers() Parameters

All parameters are optional:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | `number` | `1` | Page number for pagination |
| `limit` | `number` | `10` | Number of users per page |
| `status` | `string` | - | Filter by user status |
| `search` | `string` | - | Search users by keyword |

#### getPostbacks() Parameters

All parameters are optional:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | `number` | `1` | Page number for pagination |
| `limit` | `number` | `10` | Number of postbacks per page |
| `sort_by` | `string` | - | Sort postbacks by field (created_at, ) |
| `sort_order` | `string` | - | Sort order (asc or desc) |
| `start_date` | `string` | - | Filter from date (YYYY-MM-DD) |
| `end_date` | `string` | - | Filter until date (YYYY-MM-DD) |
| `name` | `string` | - | Filter by offer name |
| `status` | `number` | - | Filter by HTTP status code (200, 404, etc.) |
| `id` | `string` | - | Filter by specific postback ID |

#### getCountries() Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `reload` | `boolean` | `false` | Force reload (bypass cache) |

**Response Format:**
```typescript
{
  success: boolean;
  data: Array<{
    code: string;    // ISO country code (e.g., "US", "GB")
    name: string;    // Country name (e.g., "United States")
  }>;
  message?: string;
}
```

#### getCategories() Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `reload` | `boolean` | `false` | Force reload (bypass cache) |

**Response Format:**
```typescript
{
  success: boolean;
  data: Array<{
    name: string;    // Category name (e.g., "Gaming", "Finance")
    slug?: string;   // Category slug (e.g., "gaming", "finance")
    id?: string;     // Category ID (if available)
  }>;
  message?: string;
}
```

#### healthCheck() Parameters

No parameters required. Returns the API health status.

See [USAGE.md](./USAGE.md) for detailed examples and use cases.

### Advertiser Client

```typescript
const advertiser = client.advertiser;

// 1. Health check
const health = await advertiser.healthCheck();
console.log(health.status);           // API health status

// 2. Send postback
const postbackResponse = await advertiser.sendPostback({
  event_name: "create_account",
  offer_id: "offer_123",
  sub1: "sub1_value",
  tx_id: "transaction_id_123",
  isChargeback: false,
  chargebackReason: "",
  isTest: true,
});

console.log(postbackResponse.success);   // Request status
console.log(postbackResponse.message);   // Optional message
console.log(postbackResponse.data);      // Response data

// Other methods (coming soon):
// - sendConversion()
```

#### healthCheck() Parameters

No parameters required. Returns the API health status.

#### sendPostback() Parameters

All parameters are required:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `event_name` | `string` | Yes | Event name for the postback (e.g., "create_account", "conversion") |
| `offer_id` | `string` | Yes | Offer ID for the postback |
| `sub1` | `string` | Yes | Sub1 parameter for tracking |
| `tx_id` | `string` | Yes | Transaction ID for the postback |
| `isChargeback` | `boolean` | Yes | Whether this is a chargeback event |
| `chargebackReason` | `string` | Yes | Reason for chargeback (empty string if not applicable) |
| `isTest` | `boolean` | Yes | Whether this is a test postback |

**Note**: The `advertiserId` in the API route is automatically set to your API key from the SDK configuration.

## Development

### Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch mode for development
npm run dev

# Lint code
npm run lint

# Format code
npm run format
```

### Project Structure

```
src/
├── core/               # Core functionality
│   ├── http-client.ts      # HTTP client with auth and retry logic
│   ├── publisher-client.ts # Publisher API client
│   └── advertiser-client.ts # Advertiser API client
├── types/              # TypeScript type definitions
│   ├── config.ts           # Configuration types
│   ├── errors.ts           # Error classes
│   ├── publisher.ts        # Publisher-specific types
│   └── advertiser.ts       # Advertiser-specific types
├── utils/              # Utility functions
│   ├── logger.ts           # Logger utility
│   ├── validator.ts        # Config validation
│   └── auth.ts             # Authentication helpers
├── klink-sdk.ts        # Main SDK class
└── index.ts            # Package entry point
```

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions. No need to install additional `@types` packages.

```typescript
import { KlinkSDK, KlinkSDKConfig } from "@klink/sdk";

const config: KlinkSDKConfig = {
  apiKey: "your-key",
  apiSecret: "your-secret",
};

const client = new KlinkSDK(config);
```

## License

MIT

## Support

For issues, questions, or contributions, please contact the Klink team or open an issue in the repository.

## Changelog

### 0.1.0 (Initial Release)

- ✅ Initial SDK architecture setup
- ✅ Configuration and initialization
- ✅ Bearer token authentication
- ✅ HTTP client with error handling
- ✅ TypeScript support with full type definitions
- ✅ Dual module support (CommonJS + ESM)
- ✅ Publisher client with `getOffers()` method
  - Support for pagination, filtering, and search
  - Category and country multi-value support
  - Device type and platform filtering
- ✅ Publisher client with `getConversions()` method
  - Support for pagination and sorting
  - Date range filtering
  - Status and offer ID filtering
  - Payout cycle filtering
- ✅ Publisher client with `getUsers()` method
  - Fetch publisher users with pagination
  - Status filtering
  - Search functionality
- ✅ Publisher client with `getPostbacks()` method
  - Fetch postback/conversion logs
  - Date range filtering
  - Status code filtering
  - Sort and pagination support
- ✅ Publisher client with `getCountries()` method
  - Fetch supported countries with ISO codes
  - Cache reload support
- ✅ Publisher client with `getCategories()` method
  - Fetch supported categories
  - Cache reload support
- ✅ Publisher client with `healthCheck()` method
  - API health monitoring
- ✅ Advertiser client with `healthCheck()` method
  - API health monitoring
- ✅ Advertiser client with `sendPostback()` method
  - Send postback events with full parameter support
  - Support for chargeback and test flags
- ✅ Comprehensive error handling
- ✅ Debug logging support
- ✅ Complete documentation and examples

## Roadmap

- [x] Implement Publisher offers API
- [x] Implement Advertiser postback API
- [ ] Implement Publisher tracking methods
- [ ] Implement Advertiser conversion API
- [ ] Add automatic retry logic with exponential backoff
- [ ] Add comprehensive test suite
- [ ] Add request/response middleware support


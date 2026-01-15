# SDK Architecture Overview

This document outlines the architecture and design decisions for the `@klink/sdk` package.

## Design Principles

1. **Simplicity First**: Easy to initialize and use with minimal configuration
2. **Type Safety**: Full TypeScript support with comprehensive type definitions
3. **Separation of Concerns**: Clear separation between Publisher and Advertiser functionality
4. **Extensibility**: Easy to add new features and endpoints
5. **Error Handling**: Comprehensive error types for different failure scenarios
6. **Security**: Built-in request signing and authentication

## Project Structure

```
.
├── src/
│   ├── core/                   # Core SDK functionality
│   │   ├── http-client.ts      # HTTP client with auth, retries, and error handling
│   │   ├── publisher-client.ts # Publisher-specific API methods
│   │   └── advertiser-client.ts# Advertiser-specific API methods
│   │
│   ├── types/                  # TypeScript type definitions
│   │   ├── config.ts           # SDK configuration types
│   │   ├── errors.ts           # Custom error classes
│   │   ├── publisher.ts        # Publisher-specific types
│   │   ├── advertiser.ts       # Advertiser-specific types
│   │   └── index.ts            # Type exports
│   │
│   ├── utils/                  # Utility functions
│   │   ├── logger.ts           # Debug logging utility
│   │   ├── validator.ts        # Configuration validation
│   │   ├── auth.ts             # Authentication helpers
│   │   └── index.ts            # Utility exports
│   │
│   ├── klink-sdk.ts           # Main SDK class
│   └── index.ts               # Package entry point
│
├── examples/                   # Usage examples
│   ├── publisher-example.ts
│   ├── advertiser-example.ts
│   └── error-handling.ts
│
├── dist/                       # Compiled output (generated)
│   ├── cjs/                    # CommonJS build
│   ├── esm/                    # ES Module build
│   └── types/                  # TypeScript declarations
│
├── package.json               # Package configuration
├── tsconfig.json              # Base TypeScript config
├── tsconfig.cjs.json          # CommonJS build config
├── tsconfig.esm.json          # ESM build config
├── tsconfig.types.json        # Type declarations config
├── .eslintrc.json             # ESLint configuration
├── .prettierrc.json           # Prettier configuration
├── .gitignore                 # Git ignore rules
├── .npmignore                 # NPM publish ignore rules
├── README.md                  # User documentation
├── ARCHITECTURE.md            # This file
└── LICENSE                    # MIT License
```

## Core Components

### 1. KlinkSDK (Main Class)

**Location**: `src/klink-sdk.ts`

The main entry point for the SDK. Handles:
- Configuration validation and resolution
- Mode-based client initialization
- Logger setup
- HTTP client instantiation

**Key Features**:
- Single initialization point
- Mode-specific client access via getters
- Configuration defaults
- Immutable configuration after initialization

### 2. HttpClient

**Location**: `src/core/http-client.ts`

Wrapper around Axios that provides:
- Automatic authentication header injection
- Request signing using HMAC-SHA256
- Error transformation to SDK error types
- Request/response logging in debug mode
- Timeout handling

**Key Features**:
- Axios interceptors for auth and error handling
- Typed response methods (get, post, put, delete, patch)
- Automatic retry logic (to be implemented)

### 3. PublisherClient

**Location**: `src/core/publisher-client.ts`

Handles all Publisher-specific API operations:
- Fetching offers
- Tracking clicks
- Tracking events
- Other publisher-specific methods (to be defined)

**Status**: Architecture ready, methods to be implemented

### 4. AdvertiserClient

**Location**: `src/core/advertiser-client.ts`

Handles all Advertiser-specific API operations:
- Sending postbacks
- Sending conversion events
- Other advertiser-specific methods (to be defined)

**Status**: Architecture ready, methods to be implemented

## Authentication Flow

```
1. User initializes SDK with apiKey and apiSecret
2. SDK stores credentials securely in memory
3. On each request:
   a. Generate timestamp
   b. Create payload string (timestamp + request body)
   c. Sign payload with HMAC-SHA256 using apiSecret
   d. Add headers:
      - X-API-Key: {apiKey}
      - X-Timestamp: {timestamp}
      - X-Signature: {hmac_signature}
4. Server validates signature and processes request
```

## Error Handling

Custom error hierarchy:

```
KlinkSDKError (Base)
├── KlinkConfigError      # Invalid configuration
├── KlinkAuthError        # Authentication failures (401, 403)
├── KlinkAPIError         # API errors with status codes
├── KlinkNetworkError     # Network/timeout issues
└── KlinkValidationError  # Request validation errors
```

Each error provides:
- Descriptive message
- Error type for easy identification
- Additional context (status codes, response data, etc.)

## Build System

### Dual Module Support

The SDK is built to support both CommonJS and ES Modules:

1. **CommonJS** (`dist/cjs/`)
   - For Node.js with `require()`
   - Built with `module: "commonjs"`

2. **ES Modules** (`dist/esm/`)
   - For modern Node.js with `import`
   - For bundlers (webpack, rollup, etc.)
   - Built with `module: "ES2020"`

3. **TypeScript Declarations** (`dist/types/`)
   - Type definitions for TypeScript users
   - Generated from source code

### Build Scripts

- `npm run build` - Complete build (CJS + ESM + Types)
- `npm run build:cjs` - CommonJS build only
- `npm run build:esm` - ES Module build only
- `npm run build:types` - Type declarations only
- `npm run dev` - Watch mode for development

## Configuration

### Required Configuration

```typescript
{
  mode: "publisher" | "advertiser",  // Operating mode
  apiKey: string,                     // API authentication key
  apiSecret: string                   // Secret for request signing
}
```

### Optional Configuration

```typescript
{
  baseUrl?: string,        // Default: "https://api.klinkfinance.com"
  timeoutMs?: number,      // Default: 8000
  debug?: boolean          // Default: false
}
```

## Future Enhancements

### Phase 2 (After Initial Implementation)
- [ ] Automatic retry logic with exponential backoff
- [ ] Request rate limiting
- [ ] Response caching
- [ ] Webhook signature verification
- [ ] Bulk operations support

### Phase 3 (Advanced Features)
- [ ] Request queuing
- [ ] Offline support
- [ ] Analytics and metrics
- [ ] Custom middleware support
- [ ] Event emitter for lifecycle hooks

## Development Guidelines

### Adding New API Methods

1. Define types in appropriate file (`types/publisher.ts` or `types/advertiser.ts`)
2. Implement method in client class (`PublisherClient` or `AdvertiserClient`)
3. Add JSDoc comments with usage examples
4. Update README with new method documentation
5. Add example in `examples/` directory
6. Add tests (when test suite is set up)

### Adding New Error Types

1. Define error class in `types/errors.ts`
2. Extend from `KlinkSDKError`
3. Implement custom properties if needed
4. Update error handling in `http-client.ts`
5. Document in README

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules (see `.eslintrc.json`)
- Format with Prettier (see `.prettierrc.json`)
- Write clear JSDoc comments
- Use meaningful variable names

## Testing Strategy (To Be Implemented)

1. **Unit Tests**
   - Test individual functions and methods
   - Mock external dependencies
   - Test error conditions

2. **Integration Tests**
   - Test SDK initialization
   - Test API client methods
   - Test error handling

3. **E2E Tests**
   - Test against staging API
   - Test complete workflows
   - Test error scenarios

## Performance Considerations

- Lazy initialization of clients
- Connection pooling via Axios
- Request timeouts to prevent hanging
- Memory-efficient error handling
- No unnecessary data transformations

## Security Considerations

- Never log sensitive data (API keys, secrets)
- Secure request signing using HMAC
- Validate all configuration inputs
- Use HTTPS for all API requests
- No credential storage on disk

## Maintenance

### Version Updates

Follow semantic versioning:
- **MAJOR**: Breaking API changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### Release Process

1. Update version in `package.json`
2. Update CHANGELOG in README.md
3. Run `npm run build` to ensure clean build
4. Run tests (when available)
5. Publish to NPM: `npm publish`

## Support

For questions or issues with the architecture, contact the development team.


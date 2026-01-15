# Examples

This directory contains usage examples for the Klink SDK.

## Running Examples

Before running examples, make sure you have:

1. Installed dependencies:
   ```bash
   npm install
   ```

2. Built the project:
   ```bash
   npm run build
   ```

3. Set up your environment variables:
   ```bash
   export KLINK_API_KEY="your-api-key"
   export KLINK_API_SECRET="your-api-secret"
   ```

## Available Examples

### Publisher Examples

- **publisher-example.ts** - Complete publisher usage examples
  - Fetch all offers
  - Filter offers by category, country, device
  - Search offers by name
  - Multiple countries filtering

### Advertiser Examples

- **advertiser-example.ts** - Advertiser mode initialization (methods coming soon)

### Error Handling

- **error-handling.ts** - Comprehensive error handling examples
  - Configuration errors
  - Authentication errors
  - API errors
  - Network errors

## Running with ts-node

If you want to run TypeScript examples directly:

```bash
# Install ts-node
npm install -g ts-node

# Run an example
ts-node examples/publisher-example.ts
```

## Converting to JavaScript

All examples can be easily converted to JavaScript:

1. Remove type annotations
2. Change imports if using CommonJS
3. Run with Node.js

Example conversion:

```typescript
// TypeScript
import { KlinkSDK } from "@klink/sdk";
// Use factory method - performs health check before initialization
const client: KlinkSDK = await KlinkSDK.create({ ... });
```

```javascript
// JavaScript (ESM)
import { KlinkSDK } from "@klink/sdk";
// Use factory method - performs health check before initialization
const client = await KlinkSDK.create({ ... });
```

```javascript
// JavaScript (CommonJS)
const { KlinkSDK } = require("@klink/sdk");
// Use factory method - performs health check before initialization
const client = await KlinkSDK.create({ ... });
```

## Need Help?

- Check the [main README](../README.md) for installation and setup
- Review [USAGE.md](../USAGE.md) for detailed API documentation
- See [ARCHITECTURE.md](../ARCHITECTURE.md) for technical details



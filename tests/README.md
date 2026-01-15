# Test Suite

This directory contains comprehensive test cases for the Klink SDK.

## Structure

```
tests/
├── __mocks__/              # Mock implementations
│   ├── http-client.mock.ts
│   └── logger.mock.ts
├── core/                   # Core functionality tests
│   ├── publisher-client.test.ts
│   └── advertiser-client.test.ts
└── README.md              # This file
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

### Publisher Client Tests

- ✅ `getOffers()` - All filter combinations, array handling, error cases
- ✅ `getConversions()` - Date ranges, sorting, filtering, error cases
- ✅ `getUsers()` - Pagination, search, status filtering, error cases
- ✅ `getPostbacks()` - All filters, status codes, error cases
- ✅ `healthCheck()` - Success and error cases

### Advertiser Client Tests

- ✅ `healthCheck()` - Success and error cases
- ✅ `sendPostback()` - Parameter validation, boolean conversion, error cases

## Test Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Mocking**: HTTP client and logger are mocked to avoid real API calls
3. **Coverage**: Tests cover success cases, error cases, and edge cases
4. **Descriptive Names**: Test names clearly describe what is being tested
5. **Arrange-Act-Assert**: Tests follow the AAA pattern
6. **Cleanup**: Mocks are cleared after each test

## Adding New Tests

When adding new functionality:

1. Create test file in appropriate directory
2. Mock dependencies using `__mocks__` utilities
3. Test both success and error scenarios
4. Test edge cases and parameter validation
5. Ensure tests are isolated and don't depend on each other
6. Update this README with new test coverage

## Coverage Goals

- **Unit Tests**: 80%+ coverage for core functionality
- **Integration Tests**: Test real API interactions (when needed)
- **Edge Cases**: Test parameter validation, error handling, boundary conditions

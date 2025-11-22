# Testcontainers Setup for E2E Tests

This project uses [Testcontainers](https://testcontainers.com/) to provide consistent database testing environments across development and CI/CD pipelines.

## Overview

The e2e tests now automatically start a DynamoDB Local container before running tests and clean up afterwards. This ensures:

- **Consistency**: Tests run the same way locally and in CI
- **Isolation**: Each test run gets a fresh database instance
- **No external dependencies**: No need to have DynamoDB Local running manually

## How It Works

### Test Setup (`test/test-setup.ts`)

The `TestDatabaseSetup` class manages the DynamoDB container lifecycle:

1. **`startDynamoDBContainer()`**: Starts a DynamoDB Local container and configures the client
2. **`createEpisodesTable()`**: Creates the Episodes table in the container
3. **`cleanupEpisodesTable()`**: Drops the table between tests for isolation
4. **`stopDynamoDBContainer()`**: Stops and removes the container

### Test Configuration

The e2e tests use the following lifecycle:

- **`beforeAll`**: Start container and create initial table (once per test suite)
- **`beforeEach`**: Clean and recreate table (ensures test isolation)
- **`afterEach`**: Close app instance
- **`afterAll`**: Stop and remove container

## Prerequisites

### Local Development

- Docker Desktop (or compatible container runtime)
- Node.js and pnpm
- No manual DynamoDB Local setup required

### CI/CD

The same setup works in CI environments with Docker support, including:

- GitHub Actions (with `ubuntu-latest` or similar)
- GitLab CI
- Jenkins with Docker
- Any CI system with Docker support

## Running Tests

```bash
# Run all e2e tests
pnpm run test:e2e

# Run specific e2e test
pnpm run test:e2e -- episodes.e2e-spec.ts
```

## Container Configuration

The DynamoDB Local container is configured with:

- **Image**: `amazon/dynamodb-local:latest`
- **Port**: 8000 (mapped to random host port)
- **Mode**: In-memory with shared DB
- **Credentials**: Dummy credentials (required by AWS SDK)

## Environment Variables Set

During testing, the following environment variables are automatically configured:

- `DYNAMODB_ENDPOINT`: Container endpoint URL
- `AWS_REGION`: Set to `us-east-1`
- `AWS_ACCESS_KEY_ID`: Set to `dummy`
- `AWS_SECRET_ACCESS_KEY`: Set to `dummy`

## Benefits

1. **No Manual Setup**: Developers don't need to install or manage DynamoDB Local
2. **Version Consistency**: All developers and CI use the same DynamoDB version
3. **Test Isolation**: Each test run is completely isolated
4. **CI/CD Ready**: Works out-of-the-box in containerized CI environments
5. **Fast Cleanup**: Containers are automatically removed after tests

## Troubleshooting

### Container Startup Issues

If tests fail with container startup errors:

1. Ensure Docker is running
2. Check Docker has sufficient resources
3. Verify network connectivity to pull images

### Performance

- First run may be slower due to image download
- Subsequent runs use cached images
- Container startup typically takes 2-5 seconds

### Memory Usage

The DynamoDB Local container uses minimal resources:
- ~50MB RAM
- No persistent storage (in-memory mode)

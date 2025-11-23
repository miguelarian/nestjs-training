# NestJS Training Project

<p style="text-align: center;">
<a href="https://github.com/miguelarian/nestjs-training/actions/workflows/ci.yml" target="_blank"><img src="https://img.shields.io/github/actions/workflow/status/miguelarian/nestjs-training/ci.yml?branch=main&label=build" alt="Build Status" /></a>
<a href="https://app.codecov.io/github/miguelarian/nestjs-training" target="_blank"><img src="https://codecov.io/github/miguelarian/nestjs-training/graph/badge.svg?token=Y6CTHBWGV2" alt="Codecov" /></a>
<a href="https://github.com/miguelarian/nestjs-training" target="_blank"><img src="https://img.shields.io/github/license/miguelarian/nestjs-training" alt="License" /></a>
<a href="https://github.com/miguelarian/nestjs-training" target="_blank"><img src="https://img.shields.io/github/last-commit/miguelarian/nestjs-training" alt="Last Commit" /></a>
</p>

<p style="text-align: center;">
<a href="https://nodejs.org" target="_blank"><img src="https://img.shields.io/badge/node-24-brightgreen?logo=node.js&logoColor=white" alt="Node Version" /></a>
<a href="https://www.typescriptlang.org" target="_blank"><img src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white" alt="TypeScript" /></a>
<a href="https://nestjs.com" target="_blank"><img src="https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white" alt="NestJS" /></a>
<a href="https://pnpm.io" target="_blank"><img src="https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white" alt="PNPM" /></a>
<a href="https://jestjs.io" target="_blank"><img src="https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white" alt="Jest" /></a>
<a href="https://docker.com" target="_blank"><img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" alt="Docker" /></a>
</p>

<p style="text-align: center;">
<a href="https://aws.amazon.com/dynamodb" target="_blank"><img src="https://img.shields.io/badge/DynamoDB-4053D6?logo=amazon-dynamodb&logoColor=white" alt="DynamoDB" /></a>
<a href="https://aws.amazon.com" target="_blank"><img src="https://img.shields.io/badge/AWS-232F3E?logo=amazon-aws&logoColor=white" alt="AWS" /></a>
<a href="https://testcontainers.com" target="_blank"><img src="https://img.shields.io/badge/Testcontainers-9B489A?logo=testcontainers&logoColor=white" alt="Testcontainers" /></a>
<a href="https://eslint.org" target="_blank"><img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white" alt="ESLint" /></a>
</p>

<p style="text-align: center;">
<a href="https://github.com/miguelarian/nestjs-training" target="_blank"><img src="https://img.shields.io/github/languages/top/miguelarian/nestjs-training" alt="Top Language" /></a>
<a href="https://github.com/miguelarian/nestjs-training" target="_blank"><img src="https://img.shields.io/github/languages/code-size/miguelarian/nestjs-training" alt="Code Size" /></a>
<a href="https://github.com/miguelarian/nestjs-training" target="_blank"><img src="https://img.shields.io/github/repo-size/miguelarian/nestjs-training" alt="Repo Size" /></a>
<a href="https://github.com/miguelarian/nestjs-training/commits/main" target="_blank"><img src="https://img.shields.io/github/commit-activity/m/miguelarian/nestjs-training" alt="Commit Activity" /></a>
</p>

## Description

A NestJS training project demonstrating modern backend development patterns and practices.

## Project setup

```bash
$ pnpm install
```

## Environment Configuration

The application automatically loads environment variables from a `.env` file in the project root. The `.env` file contains configuration for:

- `API_KEY`: Secret key for API authentication
- `EPISODES_TABLE`: DynamoDB table name for episodes
- `DYNAMODB_LOCAL`: Set to `true` for local DynamoDB development
- `DYNAMODB_ENDPOINT`: Custom DynamoDB endpoint (defaults to `http://localhost:8000` when `DYNAMODB_LOCAL=true`)
- `AWS_REGION`: AWS region for DynamoDB
- `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY`: AWS credentials (dummy values for local development)

Environment variables are loaded via `dotenv` on application startup.

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests (uses testcontainers - requires Docker)
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Code Coverage Reporting

The CI/CD pipeline automatically generates and publishes code coverage reports to [Codecov](https://app.codecov.io/github/miguelarian/nestjs-training) after running the test suite. This provides:

- **Detailed Coverage Reports**: View line-by-line coverage for each file
- **Pull Request Analysis**: Automatic coverage comparison on PRs
- **Coverage Trends**: Track coverage changes over time
- **Branch Coverage**: Monitor coverage across different branches

Coverage reports are generated using Jest's built-in coverage functionality and uploaded to Codecov during the CI pipeline execution. You can view the latest coverage report by clicking the Codecov badge above.

### E2E Testing with Testcontainers

This project uses [Testcontainers](https://testcontainers.com/) for e2e tests to provide consistent database testing environments. The e2e tests automatically:

- Start a DynamoDB Local container before running tests
- Create and manage test database tables
- Clean up containers after tests are complete

**Requirements for e2e tests:**
- Docker Desktop (or compatible container runtime)
- No manual DynamoDB Local setup required

For detailed information about the testcontainers setup, see [docs/TESTCONTAINERS.md](docs/TESTCONTAINERS.md).

## Testing GitHub Actions Locally with Act

You can test the GitHub Actions CI pipeline locally using [Act](https://github.com/nektos/act), which runs your GitHub Actions workflows locally using Docker.

### Prerequisites

1. **Install Act**: Follow the installation instructions for your platform at [nektos/act](https://github.com/nektos/act#installation)
2. **Docker**: Ensure Docker is running on your system

### Installation

```bash
# macOS (using Homebrew)
brew install act

# Linux (using curl)
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Windows (using chocolatey)
choco install act-cli
```

### Running the CI Pipeline Locally

```bash
# Run all jobs in the CI workflow
act

# Run only specific jobs (e.g., the 'test' job)
act -j test

# Run with specific event trigger
act push

# Run with verbose output for debugging
act -v

# Use a specific platform (recommended for consistency)
act --platform ubuntu-latest=catthehacker/ubuntu:act-latest
```

### Common Act Configuration

Create a `.actrc` file in your project root for consistent behavior:

```bash
# .actrc
--platform ubuntu-latest=catthehacker/ubuntu:act-latest
--container-architecture linux/amd64
```

### Troubleshooting Act

**Issue: pnpm not found**
- This is the same error you might see in the actual CI
- Act may use different base images that don't include pnpm
- Solution: Use the recommended platform image or specify a custom image

**Issue: Docker-in-Docker not working**
- Testcontainers requires Docker access
- Run act with: `act --privileged` or use `act --bind`

**Issue: Missing environment variables**
- Create a `.env` file or use: `act --env-file .env.local`
- For secrets, use: `act --secret-file .secrets`

### Limitations

- Some GitHub-specific features may not work identically
- Performance may differ from actual GitHub runners  
- Network access and external services behavior may vary
- Docker-in-Docker scenarios (like testcontainers) may require additional configuration

**Note**: Act is excellent for quick feedback on workflow syntax and basic functionality, but always verify critical changes on actual GitHub Actions runners.

For detailed information about Act setup, troubleshooting, and advanced usage, see [docs/ACT.md](docs/ACT.md).

## Deployment

This project is configured for deployment with standard containerization and cloud deployment practices. See the CI/CD pipeline configuration for automated deployment workflows.

## License

This project is [MIT licensed](LICENSE).

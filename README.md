<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://codecov.io/gh/miguelvela/nestjs-training" target="_blank"><img src="https://codecov.io/gh/miguelvela/nestjs-training/branch/master/graph/badge.svg" alt="Codecov" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

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

The CI/CD pipeline automatically generates and publishes code coverage reports to [Codecov](https://codecov.io) after running the test suite. This provides:

- **Detailed Coverage Reports**: View line-by-line coverage for each file
- **Pull Request Analysis**: Automatic coverage comparison on PRs
- **Coverage Trends**: Track coverage changes over time
- **Branch Coverage**: Monitor coverage across different branches

Coverage reports are generated using Jest's built-in coverage functionality and uploaded to Codecov during the CI pipeline execution. You can view the latest coverage report by clicking the Codecov badge above.

### E2E Testing with Testcontainers

This project uses [Testcontainers](https://testcontainers.com/) for e2e tests to provide consistent database testing environments. The e2e tests automatically:

- Start a DynamoDB Local container before running tests
- Create and manage test database tables
- Clean up containers after tests complete

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

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

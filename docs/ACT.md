# Testing GitHub Actions Locally with Act

This document provides detailed instructions for testing the GitHub Actions CI pipeline locally using [Act](https://github.com/nektos/act).

## What is Act?

Act is a tool that allows you to run GitHub Actions workflows locally using Docker. This is particularly useful for:
- Testing workflow changes before pushing to GitHub
- Debugging CI failures
- Faster development feedback loops
- Offline development and testing

## Installation

### macOS
```bash
# Using Homebrew (recommended)
brew install act

# Using MacPorts
sudo port install act
```

### Linux
```bash
# Using curl
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Using GitHub releases
wget https://github.com/nektos/act/releases/latest/download/act_Linux_x86_64.tar.gz
tar xf act_Linux_x86_64.tar.gz
sudo mv act /usr/local/bin/
```

### Windows
```bash
# Using Chocolatey
choco install act-cli

# Using Scoop
scoop install act

# Using Winget
winget install nektos.act
```

## Configuration

The project includes an `.actrc` configuration file with recommended settings:

```bash
# .actrc
--platform ubuntu-latest=catthehacker/ubuntu:act-latest
--container-architecture linux/amd64
--privileged
--verbose
```

### Platform Images

Act uses Docker images to simulate GitHub Actions runners. The recommended image `catthehacker/ubuntu:act-latest` includes:
- Common development tools
- Node.js (multiple versions)
- Package managers (npm, yarn, pnpm)
- Docker support
- Better compatibility with GitHub Actions

## Usage

### Basic Commands

```bash
# List available workflows
act -l

# Run all workflows
act

# Run specific workflow
act -W .github/workflows/ci.yml

# Run specific job
act -j test

# Run with specific event
act push
act pull_request
```

### Advanced Usage

```bash
# Run with custom environment file
act --env-file .env.local

# Run with secrets
act --secret-file .secrets

# Run with specific platform
act --platform ubuntu-latest=node:18-bullseye

# Dry run (show what would be executed)
act --dryrun

# Interactive mode
act --interactive

# Bind mount volumes for better performance
act --bind
```

## Addressing Common Issues

### Issue: "pnpm: command not found"

This error occurs when the Docker image doesn't include pnpm. Solutions:

1. **Use the recommended platform image** (already configured in `.actrc`):
   ```bash
   act --platform ubuntu-latest=catthehacker/ubuntu:act-latest
   ```

2. **Use a Node.js image with pnpm**:
   ```bash
   act --platform ubuntu-latest=node:18-bullseye
   ```

3. **Create a custom Dockerfile** for your needs:
   ```dockerfile
   FROM catthehacker/ubuntu:act-latest
   RUN npm install -g pnpm@8
   ```

### Issue: Docker-in-Docker for Testcontainers

Since this project uses Testcontainers for e2e tests, Docker-in-Docker is required:

```bash
# Run with privileged mode (already in .actrc)
act --privileged

# Alternative: bind Docker socket
act --bind /var/run/docker.sock:/var/run/docker.sock
```

### Issue: Missing Environment Variables

1. **Create `.env.local`** for environment variables:
   ```bash
   NODE_ENV=test
   API_KEY=test-key-123
   EPISODES_TABLE=episodes-test
   DYNAMODB_LOCAL=true
   ```

2. **Create `.secrets`** for sensitive data (copy from `.secrets.example`):
   ```bash
   CODECOV_TOKEN=your-codecov-token
   ```

3. **Run with files**:
   ```bash
   act --env-file .env.local --secret-file .secrets
   ```

## Testing Strategies

### Quick Syntax Check
```bash
# Fast check for YAML syntax and basic workflow structure
act --dryrun
```

### Individual Job Testing
```bash
# Test just the main CI job
act -j test

# Test with verbose output for debugging
act -j test --verbose
```

### Full Pipeline Simulation
```bash
# Run complete pipeline as it would run on GitHub
act push
```

## Performance Tips

1. **Use volume binding** for better file I/O:
   ```bash
   act --bind
   ```

2. **Reuse containers** between runs:
   ```bash
   act --reuse
   ```

3. **Use local registry** for custom images:
   ```bash
   act --use-gitignore=false
   ```

## Limitations and Considerations

### What Works Well
- ✅ Basic workflow execution
- ✅ Environment variable handling
- ✅ Secret management
- ✅ Matrix builds
- ✅ Conditional steps
- ✅ Most GitHub Actions from marketplace

### Known Limitations
- ❌ Some GitHub-specific contexts (e.g., `github.event`)
- ❌ GitHub Apps authentication
- ❌ Exact runner environment differences
- ❌ Network policies may differ
- ❌ File system permissions differences

### Best Practices

1. **Always test critical changes on actual GitHub Actions** after local testing
2. **Use Act for rapid development and basic validation**
3. **Keep Act configuration in `.actrc` for consistency**
4. **Document any Act-specific workarounds** in your workflow files
5. **Use environment-specific configuration** files for different testing scenarios

## Debugging

### Enable Debug Output
```bash
# Verbose Act output
act --verbose

# GitHub Actions debug mode
act --env ACTIONS_STEP_DEBUG=true --env ACTIONS_RUNNER_DEBUG=true
```

### Container Inspection
```bash
# List Act containers
docker ps -a | grep act

# Inspect Act container
docker logs <container-id>

# Enter running container for debugging
docker exec -it <container-id> /bin/bash
```

### Workflow Debugging
```bash
# Add debug steps to your workflow
- name: Debug Environment
  run: |
    echo "Node version: $(node --version)"
    echo "NPM version: $(npm --version)"
    echo "PNPM version: $(pnpm --version || echo 'pnpm not found')"
    echo "Environment: $NODE_ENV"
    pwd
    ls -la
```

## Integration with Development Workflow

### Pre-commit Testing
```bash
# Add to your development script
#!/bin/bash
echo "Testing GitHub Actions locally..."
act --dryrun
if [ $? -eq 0 ]; then
    echo "✅ GitHub Actions syntax valid"
    git commit "$@"
else
    echo "❌ GitHub Actions validation failed"
    exit 1
fi
```

### IDE Integration
Many editors support Act integration:
- **VS Code**: GitHub Actions extension with Act support
- **JetBrains**: GitHub Actions plugin
- **Vim/Neovim**: Various GitHub Actions plugins

## Resources

- [Act GitHub Repository](https://github.com/nektos/act)
- [Act Documentation](https://nektosact.com/usage/index.html)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Catthehacker Images](https://github.com/catthehacker/docker_images) - Recommended runner images
- [Act Community](https://github.com/nektos/act/discussions) - Community support and examples

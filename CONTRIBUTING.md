# Contributing to IaC Converter

Thank you for your interest in contributing to IaC Converter! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/iac-converter.git
   cd iac-converter
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/original-owner/iac-converter.git
   ```

## Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env.local
   # Add your Anthropic API key to .env.local
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Install git hooks (for code quality):
   ```bash
   npm run prepare
   ```

## Development Workflow

### Branch Naming Convention

Use the following prefixes for your branches:

- `feature/` - New features or enhancements
  - Example: `feature/add-gcp-support`
- `bugfix/` - Bug fixes
  - Example: `bugfix/fix-image-upload`
- `hotfix/` - Urgent production fixes
  - Example: `hotfix/api-key-validation`
- `docs/` - Documentation updates
  - Example: `docs/update-readme`
- `refactor/` - Code refactoring
  - Example: `refactor/improve-error-handling`
- `test/` - Adding or updating tests
  - Example: `test/add-conversion-tests`

### Workflow Steps

1. Create a new branch from `main`:

   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them following the [commit guidelines](#commit-guidelines)

3. Keep your branch up to date:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

4. Push your branch to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Create a pull request on GitHub

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces (avoid `any`)
- Use type inference where appropriate
- Document complex types with JSDoc comments

### Code Style

- **Formatting**: We use Prettier for code formatting
  - Run `npm run format` to format code
  - Run `npm run format:check` to check formatting

- **Linting**: We use ESLint for code quality
  - Run `npm run lint` to check for issues
  - Run `npm run lint:fix` to auto-fix issues

- **Type Checking**: Ensure TypeScript types are correct
  - Run `npm run type-check` before committing

### File Organization

- Place React components in `components/`
- Place API routes in `app/api/`
- Place utility functions in `lib/`
- Place type definitions in `types/`
- Use named exports for utilities, default exports for components

### Component Guidelines

- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use proper TypeScript types for props

Example:

```tsx
interface MyComponentProps {
  title: string;
  onSubmit: (data: string) => void;
}

export function MyComponent({ title, onSubmit }: MyComponentProps) {
  // Component implementation
}
```

### Code Comments

- Add JSDoc comments to exported functions and complex logic
- Explain "why" not "what" in comments
- Keep comments up to date with code changes

Example:

```typescript
/**
 * Converts a text description to Infrastructure as Code
 * using Claude AI vision capabilities for diagram analysis
 *
 * @param input - Natural language description or base64 image
 * @param provider - Target cloud provider (aws, azure, gcp)
 * @param formats - Desired output formats (terraform, cloudformation, etc.)
 * @returns Parsed infrastructure and generated code
 */
export async function convertToIaC(/* ... */) {
  // Implementation
}
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, missing semi-colons, etc.)
- `refactor` - Code refactoring (no functional changes)
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks (dependencies, build config, etc.)
- `ci` - CI/CD changes

### Examples

```bash
feat(converter): add support for Azure DevOps pipelines

Add Azure DevOps YAML pipeline generation for CI/CD workflows.
Includes support for multi-stage pipelines and deployment jobs.

Closes #123
```

```bash
fix(api): handle timeout errors in Claude API calls

Add retry logic with exponential backoff for API timeout errors.
Improves reliability when dealing with large diagram conversions.
```

```bash
docs(readme): update installation instructions

Clarify Node.js version requirements and API key setup process.
```

### Breaking Changes

For breaking changes, add `BREAKING CHANGE:` in the commit footer:

```bash
feat(api): change response format for conversion endpoint

BREAKING CHANGE: The API response now returns `generatedCode` instead of `code`.
Update client code to use the new response structure.
```

## Pull Request Process

### Before Submitting

1. Ensure all tests pass (when available)
2. Run linting and fix any issues: `npm run lint:fix`
3. Run type checking: `npm run type-check`
4. Format your code: `npm run format`
5. Update documentation if needed
6. Update CHANGELOG.md if applicable

### Pull Request Template

When creating a PR, include:

- **Description**: Clear description of what changes were made and why
- **Type of Change**: Feature, bug fix, documentation, etc.
- **Testing**: How you tested the changes
- **Screenshots**: For UI changes, include before/after screenshots
- **Related Issues**: Link to related issues (e.g., "Closes #123")
- **Checklist**: Complete the PR checklist

### Code Review

- Be open to feedback and suggestions
- Respond to comments promptly
- Make requested changes in new commits (don't force push)
- Once approved, squash commits if requested

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tests added/updated (when applicable)
- [ ] All tests passing
- [ ] No breaking changes (or documented if unavoidable)

## Testing

Currently, the project focuses on manual testing. When adding features:

1. Test the feature manually in the browser
2. Test edge cases and error conditions
3. Verify functionality with different cloud providers
4. Check responsiveness on different screen sizes

### Future Testing

We plan to add:

- Unit tests with Jest
- Integration tests for API routes
- E2E tests with Playwright

## Documentation

### Code Documentation

- Add JSDoc comments to all exported functions
- Document function parameters and return values
- Include usage examples for complex functions

### Project Documentation

When making significant changes, update:

- **README.md** - For user-facing changes
- **ARCHITECTURE.md** - For architectural changes
- **API.md** - For API changes
- **DEPLOYMENT.md** - For deployment-related changes

## Questions?

If you have questions about contributing:

1. Check existing issues and discussions
2. Create a new issue with the "question" label
3. Reach out to maintainers

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to IaC Converter!

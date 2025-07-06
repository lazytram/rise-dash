# GitHub Bot Configuration

This repository is configured with automated GitHub workflows to streamline development and maintain code quality.

## Features

### 🔄 Continuous Integration (CI)

- **Automated testing** on Node.js 18.x and 20.x
- **Linting** with ESLint
- **Build verification** for Next.js
- **Test coverage** reporting
- Runs on every push to `main`/`develop` and all pull requests

### 🏷️ Auto-Labeling

When you open a pull request, the bot automatically adds labels based on:

- **File changes**: Components, hooks, tests, styling, etc.
- **Size**: XS, S, M, L, XL, XXL based on lines changed
- **Type**: Enhancement, bug fix, documentation, etc.

### 🧹 Automatic Branch Cleanup

- Automatically deletes feature branches after PR merge
- Protects main branches (`main`, `master`, `develop`, etc.)
- Only deletes branches from the same repository (not forks)

### ✅ Pull Request Checks

- **Title format validation**: Enforces conventional commit format
- **Breaking change detection**: Auto-labels potential breaking changes
- **Status reporting**: Comments on PR with check results
- **Build and test validation**: Ensures code quality before merge

### 🤖 Dependabot Integration

- **Weekly dependency updates** every Monday at 9 AM
- **Auto-merge** for patch and minor updates after CI passes
- **Automatic assignment** to repository maintainers
- Separate tracking for npm and GitHub Actions updates

## Required Labels

Create these labels in your GitHub repository:

### Type Labels

- `enhancement` - New features
- `bug` - Bug fixes
- `documentation` - Documentation changes
- `configuration` - Config file changes

### Component Labels

- `component` - React component changes
- `hooks` - Custom hooks
- `state-management` - Store/state changes
- `tests` - Test file changes
- `styling` - CSS/styling changes
- `i18n` - Internationalization changes
- `game-logic` - Game-related logic
- `ui` - User interface changes

### Process Labels

- `ci-cd` - CI/CD related changes
- `dependencies` - Dependency updates
- `breaking-change` - Potentially breaking changes
- `auto-merge` - For dependabot PRs

### Size Labels

- `small` - Small changes (0-50 lines)
- `medium` - Medium changes (51-200 lines)
- `large` - Large changes (200+ lines)

## PR Title Format

Use conventional commit format for PR titles:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes

Example: `feat: add new game scoring system`

## Setup Instructions

1. **Enable GitHub Actions** in your repository settings
2. **Create the required labels** listed above
3. **Set up branch protection rules** for your main branch
4. **Configure repository settings**:
   - Enable "Automatically delete head branches"
   - Require status checks before merging
   - Enable auto-merge for the repository

## Workflow Files

- `.github/workflows/ci.yml` - Main CI pipeline
- `.github/workflows/auto-label.yml` - Auto-labeling for PRs
- `.github/workflows/auto-delete-branch.yml` - Branch cleanup
- `.github/workflows/pr-checks.yml` - PR validation
- `.github/workflows/dependabot-auto-merge.yml` - Dependabot automation
- `.github/dependabot.yml` - Dependabot configuration
- `.github/labeler.yml` - Label configuration

All workflows use the `GITHUB_TOKEN` which is automatically provided by GitHub Actions.

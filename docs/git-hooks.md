# Git Hooks

This document explains the Git hooks configuration using Husky and lint-staged.

## Overview

Git hooks automatically run tasks at specific points in the Git workflow. This project uses Husky to manage hooks and lint-staged to efficiently format only staged files.

## Tools Used

- **Husky 9** - Modern Git hooks management
- **lint-staged** - Run commands on staged files only
- **Prettier** - Code formatter

## Pre-commit Hook

The pre-commit hook runs before each commit and performs the following steps:

### Step 1: Format Staged Files

```bash
npx lint-staged
```

**What it does:**

- Runs Prettier on all staged files matching `*.{ts,tsx,css,md,json}`
- Formats files according to `.prettierrc.json` configuration
- Automatically re-stages the formatted files
- Only processes staged files (not the entire codebase) for performance

**How it works:**

1. Creates a stash backup of unstaged changes
2. Runs formatters on staged files
3. Re-adds formatted files to staging
4. Restores unstaged changes from stash

### Step 2: Run Tests

```bash
npm test
```

**What it does:**

- Runs all unit tests (`.spec.ts`) and e2e tests (`.e2e.ts`)
- Builds the project in dev mode
- Executes Jest test suite
- **Aborts the commit if any test fails**

### Step 3: Analyze Code Complexity

```bash
npm run fta
```

**What it does:**

- Runs FTA (Fast TypeScript Analyzer) on all source files
- Analyzes code complexity and maintainability
- Provides scores for each file (lower is better)
- **Aborts the commit if any file exceeds the complexity threshold** (default: 1000)

## Configuration Files

### `.husky/pre-commit`

```bash
#!/bin/sh
# Run lint-staged to format staged files and re-add them
npx lint-staged

# Run tests - if they fail, the commit will be aborted
npm test

# Run FTA code analysis - if complexity is too high, the commit will be aborted
npm run fta
```

### `package.json` (lint-staged config)

```json
{
  "lint-staged": {
    "*.{ts,tsx,css,md,json}": ["prettier --write"]
  }
}
```

## Installation

Hooks are automatically installed when running:

```bash
npm install
```

This triggers the `prepare` script which runs `husky` to set up the hooks.

## Skipping Hooks (Not Recommended)

In rare cases where you need to skip the pre-commit hook:

```bash
git commit --no-verify -m "your message"
```

**Warning:** Only use `--no-verify` in exceptional circumstances (e.g., emergency hotfix). Skipping hooks bypasses quality checks.

## Common Scenarios

### Scenario 1: Formatting Changes

```bash
# Stage your changes
git add src/components/my-component.tsx

# Attempt to commit
git commit -m "Add new feature"

# Hook runs:
# 1. Prettier formats my-component.tsx (if needed)
# 2. File is re-staged with formatting applied
# 3. Tests run and pass
# 4. FTA analyzes code complexity
# 5. Commit completes if complexity is acceptable
```

### Scenario 2: Test Failure

```bash
# Stage changes with a failing test
git add src/components/broken-component.tsx

# Attempt to commit
git commit -m "Add broken feature"

# Hook runs:
# 1. Prettier formats the file
# 2. Tests run and FAIL
# 3. Commit is ABORTED
# 4. You see test output showing which tests failed
```

### Scenario 3: No Changes Needed

```bash
# Stage already-formatted file
git add src/components/good-component.tsx

# Attempt to commit
git commit -m "Add feature"

# Hook runs:
# 1. Prettier checks file (no changes needed)
# 2. Tests run and pass
# 3. Commit completes successfully
```

## Troubleshooting

### Hook Not Running

If hooks aren't running, reinstall them:

```bash
npx husky install
```

### Hook Permission Denied

Make the hook executable:

```bash
chmod +x .husky/pre-commit
```

### Tests Taking Too Long

If tests are too slow for frequent commits, consider:

- Running only unit tests in the pre-commit hook
- Moving e2e tests to a pre-push hook
- Using `--maxWorkers` to limit parallelism

Example modification to `.husky/pre-commit`:

```bash
# Only run unit tests in pre-commit
npm run test -- --spec
```

Then create `.husky/pre-push` for e2e tests:

```bash
#!/bin/sh
# Run e2e tests before pushing
npm run test -- --e2e
```

### FTA Score Too High

If FTA fails due to high complexity:

```bash
# Commit fails with FTA error
# Refactor the code to reduce complexity
# Common fixes:
# - Break down large functions
# - Reduce nesting levels
# - Extract complex logic into separate functions
# - Simplify conditional statements
```

To temporarily bypass (not recommended):

```bash
git commit --no-verify -m "message"
```

## Benefits

1. **Consistent Formatting** - All commits have properly formatted code
2. **No Test Regressions** - Failing tests prevent broken code from being committed
3. **Code Quality** - High complexity code is flagged before commit
4. **Automatic** - No need to remember to format, test, or analyze
5. **Fast** - lint-staged only processes changed files
6. **Team Consistency** - Same checks for all developers

## Related Files

- `.husky/pre-commit` - Pre-commit hook script
- `package.json` - lint-staged configuration and prepare script
- `.prettierrc.json` - Prettier formatting rules
- `.prettierignore` - Files excluded from formatting
- `fta.json` - FTA code analysis configuration

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Stencil component library called "monochrome". Stencil is a compiler for building fast, standards-based Web Components using TypeScript and JSX.

## Build and Development Commands

```bash
# Install dependencies
npm install

# Development mode with watch and serve
npm start

# Production build
npm run build

# Run all tests (unit and e2e)
npm test

# Run tests in watch mode
npm run test.watch

# Generate a new component
npm generate

# Storybook for component development
npm run storybook

# Build Storybook for production
npm run build-storybook

# Format code with Prettier
npm run format

# Check formatting without modifying files
npm run format:check

# Analyze code complexity with FTA
npm run fta
```

## Architecture

### Component Structure

- Components live in `src/components/[component-name]/`
- Each component has its own directory containing:
  - `[component-name].tsx` - Component implementation
  - `[component-name].css` - Component styles
  - `[component-name].spec.ts` - Unit tests
  - `[component-name].e2e.ts` - E2E tests
  - `[component-name].stories.ts` - Storybook stories
  - `readme.md` - Auto-generated component documentation

### Build Outputs (stencil.config.ts)

The project is configured with multiple output targets:

1. **`dist`** - For lazy-loading via ESM loader (outputs to `dist/` with loader in `loader/`)
2. **`dist-custom-elements`** - For standalone component imports with auto-define behavior
3. **`docs-readme`** - Auto-generates README files for each component
4. **`www`** - Development server output (used by `npm start`)

### Key Files

- `stencil.config.ts` - Stencil build configuration with namespace 'monochrome'
- `src/index.ts` - Entry point for utilities/types (NOT for components - see consumption patterns below)
- `src/components.d.ts` - Auto-generated component type definitions
- `src/utils/` - Shared utility functions

### Component Consumption

Components should NOT be exported from `src/index.ts`. Instead:

- **Lazy loading**: Import the bootstrap script from `dist/monochrome/monochrome.esm.js`
- **Standalone**: Import individual components from `monochrome/[component-name]` when using dist-custom-elements

### Testing

- Unit tests use Jest with `.spec.ts` files
- E2E tests use Puppeteer with `.e2e.ts` files
- Tests run in headless shell mode (configured in stencil.config.ts)

### TypeScript Configuration

- JSX factory: `h` (Stencil's hyperscript function)
- Target: ES2022
- Module resolution: bundler
- Experimental decorators enabled (required for Stencil component decorators like `@Component`, `@Prop`)
- `skipLibCheck: true` - Skips type checking of node_modules to avoid JSX namespace conflicts with Storybook dependencies
- Excludes `**/*.stories.ts`, `.storybook`, and `storybook-static` from Stencil compilation

**IMPORTANT:** When modifying build configuration (tsconfig.json, stencil.config.ts, or related build settings), update `docs/build-configuration.md` to document the changes and explain why they were necessary.

### Storybook

- Storybook 9 is configured for web components using Vite
- Stories use vanilla JavaScript/TypeScript (no Lit dependency) - components are created using `document.createElement()`
- Configuration files in `.storybook/`:
  - `main.ts` - Main Storybook configuration (addons moved to core in v9)
  - `preview.ts` - Initializes Stencil components via the loader
- MDX documentation pages were removed due to v9 compatibility issues - use autodocs in stories instead
- Run `npm run build` first to generate the loader before running Storybook
- Storybook runs on http://localhost:6006

### Code Formatting

- Prettier 3 is installed for code formatting
- Configuration in `.prettierrc.json`:
  - Single quotes, semicolons, trailing commas
  - 180 character line width
  - 2-space indentation
- Files ignored via `.prettierignore` (dist/, node_modules/, generated files)
- Formatting is automatically applied via pre-commit hook (see Git Hooks below)

### Git Hooks

- Husky 9 manages Git hooks
- **Pre-commit hook** (`.husky/pre-commit`):
  1. Runs `lint-staged` to format only staged files with Prettier
  2. Automatically re-stages formatted files
  3. Runs `npm test` - commit is aborted if tests fail
  4. Runs `npm run fta` - commit is aborted if code complexity exceeds threshold (default: 1000)
- Hooks are automatically installed when running `npm install` (via `prepare` script)

### Code Analysis

- FTA (Fast TypeScript Analyzer) 3 is installed for code complexity analysis
- Configuration in `fta.json`:
  - Excludes test files (`*.e2e.ts`, `*.spec.ts`, `*.stories.ts`)
  - Excludes type definition files (`*.d.ts`)
  - Analyzes all source files including very small files (`exclude_under: 0`)
- Run `npm run fta` to analyze code complexity and maintainability
- FTA provides scores for each file (lower is better) with assessments: OK, Could be better, Needs improvement

# Build Configuration

This document explains the build configuration changes made to support both Stencil component compilation and Storybook integration.

## Problem: JSX Namespace Conflicts

When Storybook was added to the project, running `npm run build` resulted in TypeScript errors:

```
Cannot find namespace 'JSX'
```

This error occurred in two places:
1. Storybook story files (`*.stories.ts`)
2. Storybook's dependencies in `node_modules` (specifically `@types/mdx`)

### Root Cause

The issue stems from JSX namespace conflicts between different parts of the project:

- **Stencil components** use JSX with a custom factory function `h` (Stencil's hyperscript)
- **Storybook types** expect a different JSX namespace definition
- **Storybook dependencies** (`@types/mdx`) also have their own JSX type definitions

When TypeScript tried to compile everything together, it couldn't reconcile these different JSX namespaces.

### Solutions Applied

### 1. Exclude Storybook Files from Stencil Build

**File:** `tsconfig.json`

**Change:** Added story files to the exclude list:

```json
"exclude": [
  "node_modules",
  "**/*.stories.ts",
  ".storybook",
  "storybook-static"
]
```

**Reason:** Stencil doesn't need to compile Storybook story files. Stories are only used by Storybook's own build system. By excluding them, we prevent JSX namespace conflicts between Stencil's JSX types and Storybook's JSX types.

### 2. Enable skipLibCheck

**File:** `tsconfig.json`

**Change:** Added `skipLibCheck` to compiler options:

```json
"compilerOptions": {
  // ... other options
  "skipLibCheck": true
}
```

**Reason:** This tells TypeScript to skip type checking of declaration files (`.d.ts`) in `node_modules`. This is a recommended best practice that:

- **Prevents third-party type conflicts** - Libraries may have incompatible type definitions (like the JSX namespace issue with `@types/mdx`)
- **Improves build performance** - Skipping library type checks significantly speeds up compilation
- **Focuses on your code** - You still get full type checking for your own source files

### 3. Fix Package Exports Order

**File:** `package.json`

**Change:** Moved `types` field before `import`/`require` in exports:

```json
"./loader": {
  "types": "./loader/index.d.ts",
  "import": "./loader/index.js",
  "require": "./loader/index.cjs"
}
```

**Reason:** The Node.js/TypeScript module resolution specification requires the `types` condition to appear first in the exports map. When `types` comes after `import` or `require`, bundlers and TypeScript will never check it because they match on the first applicable condition. This caused a Vite warning during Storybook startup. Reordering ensures TypeScript properly resolves type definitions while maintaining runtime resolution for ESM and CommonJS.

## Build Workflow

With these changes, the build process works as follows:

1. **Stencil Build** (`npm run build`):
   - Compiles only `src/**/*.ts(x)` files (excluding `*.stories.ts`)
   - Skips type checking of node_modules dependencies
   - Generates component output in `dist/` and `loader/`

2. **Storybook Build** (`npm run storybook` or `npm run build-storybook`):
   - Uses its own TypeScript/Vite configuration
   - Compiles `*.stories.ts` files with Storybook-compatible JSX types
   - Loads built components from `loader/` directory

### Important Notes

- **Always run `npm run build` before `npm run storybook`** on a fresh checkout to generate the loader
- Story files (`.stories.ts`) are only for Storybook and won't be included in the published package
- The `skipLibCheck` setting is safe and recommended by the TypeScript team for library consumers

## Related Files

- `tsconfig.json` - Main TypeScript configuration for Stencil
- `package.json` - Package exports and type definitions
- `.storybook/main.ts` - Storybook configuration
- `.storybook/preview.ts` - Loads Stencil components for Storybook

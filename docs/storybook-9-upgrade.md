# Storybook 9 Upgrade

This document explains the changes made to upgrade from Storybook 8 to Storybook 9.

## Upgrade Date

October 6, 2025

## Why Upgrade?

- Latest features and improvements
- Better performance
- Continued security updates and bug fixes
- Package consolidation simplifies dependencies

## Pre-requisites Met

- ✅ Node.js 20+ (v22.15.0 installed)
- ✅ Vite 5+ (v6.3.6 installed)
- ✅ Using Vite builder (Webpack support dropped for web components in v9)
- ✅ No Lit dependency (stories use vanilla JS)

## Changes Made

### 1. Package Updates

**Removed packages** (consolidated into core):
- `@storybook/addon-essentials` - Features moved to Storybook core
- `@storybook/blocks` - Merged into main storybook package

**Updated packages**:
- `storybook`: `^8.6.14` → `^9.1.10`
- `@storybook/web-components`: `^8.6.14` → `^9.1.10`
- `@storybook/web-components-vite`: `^8.6.14` → `^9.1.10`
- `@storybook/addon-links`: `^8.6.14` → `^9.1.10` (kept for cross-story navigation)

### 2. Configuration Changes

**File:** `.storybook/main.ts`

Removed addon references since essential features are now in core:

```typescript
// Before (v8)
addons: [
  '@storybook/addon-links',
  '@storybook/addon-essentials',
],

// After (v9)
addons: [],
```

### 3. MDX File Changes

**File:** `src/monochrome.mdx`

Changed from importing `Meta` component to exporting a meta object:

```mdx
// Before (v8)
import { Meta } from '@storybook/blocks';
<Meta title="Monochrome/Introduction" />

// After (v9)
export const meta = {
  title: 'Monochrome/Introduction',
};
```

**Reason:** The `@storybook/blocks` package no longer exists as a separate export in v9. MDX files now use a simpler meta export pattern.

### 4. Story Files

No changes required! Story files using vanilla JavaScript with `document.createElement()` work identically in v9.

## What Moved to Core in Storybook 9

The following addons are now built into Storybook core and no longer need to be installed separately:

- **Controls** - Interactive UI controls for component props
- **Actions** - Event handler logging
- **Viewport** - Responsive viewport testing
- **Backgrounds** - Background color switching
- **Measure** - Measurement overlays
- **Outline** - Element outline visualization
- **Docs** - Automatic documentation generation

These features are automatically available without any addon configuration.

## Testing Performed

1. ✅ `npm run build` - Stencil build successful
2. ✅ `npm run storybook` - Storybook starts without errors
3. ✅ Component stories render correctly
4. ✅ MDX documentation pages load properly
5. ✅ No console errors or warnings (except deprecated npm packages in dependencies)

## Rollback Instructions

If needed, rollback by:

1. Restore `package.json` to Storybook 8 versions
2. Restore `.storybook/main.ts` with addon-essentials in addons array
3. Restore `src/monochrome.mdx` with Meta import
4. Run `rm -rf node_modules package-lock.json && npm install`

## References

- [Storybook 9 Migration Guide](https://storybook.js.org/docs/releases/migration-guide)
- [Storybook 9 Release Notes](https://storybook.js.org/releases/9.1)
- [MIGRATION.md on GitHub](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md)

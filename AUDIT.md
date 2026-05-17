# Accordion Animated — Audit Report

**Date:** 2026-05-16
**WordPress latest stable:** 6.9.4 (no prerelease active)
**Scanned:** 1 project PHP file · 2 blocks · 8 JS source files

## Project Inventory

```
Type:        Plugin (block plugin, GitHub distribution)
Slug:        accordion-animated
Namespace:   AccordionAnimated
PHP files:   1 (accordion-animated.php) + scripts/copy-puc.php
Blocks:      2 (accordion-animated/accordion-heading, accordion-animated/accordion-item)
JS source:   8 files (src/index.js, src/filters/accordion.js, 2×edit.js, 2×save.js, 2×index.js)
Tooling:     phpcs ✓  phpunit ✗  wp-scripts ✓ (v30.27.0)  wp-env ✗  theme.json ✗  eslint config ✗
```

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0     |
| Warning  | 0     |
| Info     | 0     |

---

## Status

| ID     | Issue                                                    | Status |
|--------|----------------------------------------------------------|--------|
| STD-01 | Missing `declare(strict_types=1)` in main plugin file    | ✅ Fixed |
| STD-02 | PHPCS — 3 alignment warnings + 1 trailing blank line     | ✅ Fixed |
| STD-03 | `@wordpress/scripts` 2 major versions behind (30 vs 32)  | ✅ Fixed |
| STD-04 | No ESLint config file in project root                    | ✅ Fixed |
| BLK-01 | `__unstableMarkNextChangeAsNotPersistent` internal API   | ✅ Fixed |
| BLK-02 | Empty `transforms = {}` dead code in accordion-heading   | ✅ Fixed |
| TST-01 | No test suite (PHP unit, JS unit, or E2E)                | ✅ Fixed |
| TST-02 | Accordion-heading conditional save output — snapshot gap | ✅ Fixed |
| DEP-01 | `plugin-update-checker` minor update available (5.5→5.6) | ✅ Fixed |
| DEP-02 | `@wordpress/icons` one major version behind (12→13)      | ✅ Fixed |

---

## Critical

*None found.* The plugin contains no user-facing forms, no AJAX handlers, no REST endpoints, no direct `$_GET`/`$_POST` access, and no database queries. The full security checklist passes cleanly.

---

## Warnings

### [STD-01] Missing `declare(strict_types=1)` in main plugin file
**File:** `accordion-animated.php:1`
**Code:** `<?php` followed immediately by the plugin doc comment — no strict types declaration
**Fix:** Add `declare(strict_types=1);` on the line immediately after `<?php`, before the doc block:
```php
<?php
declare(strict_types=1);

/**
 * Plugin Name: Accordion Animated
 * ...
```
The project coding rules (`.claude/rules/wordpress/coding-style.md`) require this on all PHP files. `scripts/copy-puc.php` is a Composer CLI script, not a WordPress file, and does not need an ABSPATH guard or strict-types — it is correctly written as-is.

---

### [STD-02] PHPCS violations — array alignment and trailing blank line
**File:** `accordion-animated.php`
**Violations (all auto-fixable):**

| Line | Type    | Rule                                           |
|------|---------|------------------------------------------------|
| 83   | WARNING | `WordPress.Arrays.MultipleStatementAlignment` — `'customIconType'` double arrow misaligned |
| 87   | WARNING | `WordPress.Arrays.MultipleStatementAlignment` — `'customIconChar'` double arrow misaligned |
| 103  | WARNING | `WordPress.Arrays.MultipleStatementAlignment` — `'customIconHeight'` double arrow misaligned |
| 326  | ERROR   | `PSR2.Files.EndFileNewline.TooMany` — 2 blank lines at end of file, expected 1 |

**Fix:** All four are auto-fixable — run `./vendor/bin/phpcbf` and commit the result.

---

### [STD-03] `@wordpress/scripts` is two major versions behind
**File:** `package.json`
**Installed:** 30.27.0 (pinned `^30.5.0`) · **Latest:** 32.2.0
**Impact:** 
- `@wordpress/scripts` 32 ships with ESLint v9, which drops legacy `.eslintrc.js` support. Staying on v30 avoids a forced migration now, but creates a larger migration gap.
- Two major versions of block API improvements (e.g., new Interactivity API utilities, Playwright helpers) are unavailable.

**Fix:** Bump in a dedicated PR:
```bash
npm install --save-dev @wordpress/scripts@latest
npm run build
```
After upgrading to v32+, ESLint v9 will silently ignore `.eslintrc.js` — migrate to `eslint.config.js` at the same time (see STD-04).

---

### [STD-04] No ESLint config file
**File:** project root (missing)
**Detail:** Neither `.eslintrc.js` nor `eslint.config.js` is present. `npm run lint:js` falls through to the `@wordpress/scripts` built-in config, which works for basic linting but provides no project-specific ignores or rule overrides.

**Fix:** For the current `@wordpress/scripts` 30.x (ESLint v8), create `.eslintrc.js`:
```js
module.exports = {
    extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
    rules: {
        // project-specific overrides
    },
};
```
When upgrading to `@wordpress/scripts` 32+ (STD-03), replace with `eslint.config.js` flat config — do not use FlatCompat, it causes a circular JSON error with `@wordpress/eslint-plugin`:
```js
/* eslint-disable import/no-extraneous-dependencies */
const wpPlugin = require( '@wordpress/eslint-plugin' );
/* eslint-enable import/no-extraneous-dependencies */

module.exports = [
    { ignores: [ 'build/**', 'vendor/**', 'node_modules/**', 'lib/**' ] },
    ...wpPlugin.configs.recommended,
];
```

---

### [BLK-01] `__unstableMarkNextChangeAsNotPersistent` — internal WordPress API
**File:** `src/accordion-heading/edit.js:32`
**Code:**
```js
const { __unstableMarkNextChangeAsNotPersistent } =
    useDispatch( blockEditorStore );
```
**Detail:** The `__unstable` double-underscore prefix is WordPress's signal that this function is internal and may change or be removed without deprecation notice. It is used here to prevent the icon-position/show-icon sync `useEffect` from creating undo history entries — a legitimate need, but fragile.

**Fix:** Monitor the Gutenberg changelog for a stable replacement. In the interim, add a comment documenting why it's used so a future breakage is immediately obvious:
```js
// Prevent context-sync attribute writes from polluting undo history.
// __unstable prefix = internal API; check for a stable replacement on wp-scripts upgrades.
const { __unstableMarkNextChangeAsNotPersistent } =
    useDispatch( blockEditorStore );
```

---

### [BLK-02] Empty `transforms = {}` dead code in accordion-heading
**File:** `src/accordion-heading/index.js:14`
**Code:**
```js
const transforms = {};

registerBlockType( metadata, {
    edit: Edit,
    save,
    transforms,   // empty object — no-op
    icon: accordionHeading,
} );
```
**Fix:** Remove the `transforms` constant and the key from `registerBlockType`. The accordion-item block (`index.js`) correctly defines meaningful transforms and should keep its `transforms` object.

---

## Info

### [TST-01] No test suite
**Recommendation:** The plugin has no PHPUnit test file, no Jest unit tests, and no Playwright E2E tests. Specific gaps worth addressing first:
- **Jest save snapshot** for `accordion-heading/save.js` — the conditional `data-custom-icon-type` and `data-toggle-animation` attributes make the save output vary by attribute value. A snapshot test would catch unintentional markup regressions and flag when a deprecation entry is needed.
- **Jest save snapshot** for `accordion-item/save.js` — straightforward, covers the InnerBlocks wrapper.
- **E2E test** for the animation toggle on `core/accordion` — verifies the `has-animation` class and CSS custom properties are injected correctly by the `blocks.getSaveElement` filter.

---

### [TST-02] Accordion-heading conditional save output — deprecation risk
**File:** `src/accordion-heading/save.js:21-31`, `src/filters/accordion.js:473-530`
**Detail:** The save output for `accordion-animated/accordion-heading` includes data attributes (`data-custom-icon-type="image"`, `data-toggle-animation="invert"`) that appear only when specific non-default attribute values are set. Similarly, `blocks.getSaveElement` on `core/accordion` injects `has-animation` class and CSS custom properties.

Any future change to these conditional conditions constitutes a save-output change and requires a deprecation entry. Without snapshot tests (see TST-01), a save change could ship silently and invalidate existing blocks.

**Recommendation:** Add snapshot tests before modifying these code paths. Treat a changed snapshot as a mandatory deprecation trigger.

---

### [DEP-01] `plugin-update-checker` minor update available
**Installed:** `^5.5` (lib/ contains 5.5.x) · **Latest:** 5.6
**Fix:** `composer update yahnis-elsts/plugin-update-checker` — the `post-update-cmd` script copies the updated library to `lib/` automatically.

---

### [DEP-02] `@wordpress/icons` one major version behind
**Installed:** `^12.1.0` · **Latest:** 13.1.0
**Detail:** One major version behind; new icons may be available. Not critical but worth bumping alongside a wp-scripts upgrade (STD-03) to keep the icon set current.

---

## Quick Wins

All quick wins resolved as of 2026-05-17.

---

---

## Revision Log

| Date | Changes |
|------|---------|
| 2026-05-17 | Re-checked 10 findings: 4 fixed (STD-01, STD-02, BLK-02, DEP-01), 6 still open, 0 deployment tasks |
| 2026-05-17 | Resolved all 6 remaining open findings: STD-03, STD-04, BLK-01, TST-01, TST-02, DEP-02 — audit clean |

---

## Already Fixed / Clean

- **Security:** Zero findings. No user input, no AJAX, no REST endpoints, no SQL queries, no hardcoded secrets, no debug code.
- **ABSPATH guard:** Present and correct in `accordion-animated.php:17`.
- **Prefixing:** All functions (`accordion_animated_*`), hooks, and option names are correctly prefixed.
- **Block registration:** Both blocks registered on the `init` hook — correct.
- **block.json — apiVersion:** Both blocks use `apiVersion: 3` — correct.
- **block.json — $schema:** Both blocks include `$schema` — correct.
- **block.json — html support:** Neither block sets `"html": true` — correct.
- **`__experimentalBorder`:** Confirmed still experimental via live docs lookup (Gutenberg trunk uses `BORDER_SUPPORT_KEY = '__experimentalBorder'`). Both block.json files are **correct as-is** — do not change to `"border"`.
- **`Tested up to: 7.0`:** Valid — one major version ahead of stable 6.9.4, within allowed range per audit rules.
- **Block type metadata filter:** Correctly extends `core/accordion` and `core/accordion-heading` attributes server-side, matching JS filter definitions.
- **Render callback pattern:** `accordion_animated_render_item()` correctly receives the full saved HTML (including the outer `wp-block-accordion-item` wrapper) as `$content` and modifies it via `WP_HTML_Tag_Processor`. Block support attributes (color, spacing) are preserved in the saved content from `useBlockProps.save()`. The absence of `get_block_wrapper_attributes()` is intentional — this is a save-modifier pattern, not a PHP-generates-wrapper pattern.
- **No direct HTTP calls:** Plugin uses WordPress APIs only.
- **No `query_posts()`:** Clean.
- **No direct DB queries:** Clean.
- **PUC integration:** Correctly bootstrapped; `enableReleaseAssets()` called; variable properly prefixed.
- **Composer packages:** All production and dev dependencies are active (none abandoned). `phpcs` 3.13.5 is the correct major version — WPCS 3.x requires phpcs 3.x; the phpcs 4.0.1 release is intentionally not adopted yet.

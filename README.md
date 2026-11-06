# Accordion Animated

[![CI](https://github.com/philhoyt/Accordion-Animated/actions/workflows/ci.yml/badge.svg)](https://github.com/philhoyt/Accordion-Animated/actions/workflows/ci.yml)
[![Playground Demo](https://img.shields.io/badge/Playground_Demo-blue?logo=wordpress&logoColor=%23fff&labelColor=%233858e9&color=%233858e9)](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/philhoyt/Accordion-Animated/main/_playground/blueprint.json)

Adds an open/close height animation and a custom toggle icon to the core Accordion block, plus an accordion heading that accepts any block.

The plugin filters `core/accordion` and `core/accordion-heading` to add inspector settings, and registers two blocks of its own: `accordion-animated/accordion-item` and `accordion-animated/accordion-heading`. Nothing changes on existing accordions until you turn a setting on.

## Requirements

- WordPress 6.9 or newer (the core Accordion block)
- PHP 8.0 or newer

## Installation

1. Download `accordion-animated.zip` from the [releases page](https://github.com/philhoyt/accordion-animated/releases).
2. Go to Plugins > Add New > Upload Plugin and upload the zip.
3. Activate the plugin.

Updates are delivered from GitHub releases through the bundled Plugin Update Checker.

## Usage

Select an Accordion block and open the Animation panel in the block inspector:

- Animate open/close turns the transition on for that accordion.
- Duration (ms) runs from 100 to 1000 in steps of 50. Default 300.
- Easing offers Ease Out (default), Ease In Out, Linear, and Spring (`cubic-bezier(0.34, 1.56, 0.64, 1)`).

Select an Accordion Heading and open the Toggle Icon panel:

- Icon: Default keeps the core icon; Image uses a picture from the media library.
- Toggle animation: Default rotates the icon 45 degrees when the item opens; Invert rotates it 180 degrees.

To put more than text in a heading, insert Accordion Item Extended inside an Accordion, or select an existing core Accordion Item and transform it. The extended item contains an Accordion Heading Extended, which is an inner-blocks container, and a core Accordion Panel. Transforms run in both directions for both the item and the heading.

## How it works

### Attributes added to core blocks

`core/accordion` gets `animateTransition` (boolean, default false), `animationDuration` (number, default 300) and `animationEasing` (string, default `ease-out`). When animation is on the saved markup carries a `has-animation` class and inline `--animation-duration` and `--animation-easing` custom properties.

`core/accordion-heading` gets `customIconType`, `customIconChar`, `customIconUrl`, `customIconId`, `customIconWidth`, `customIconHeight` and `toggleAnimation`. With an image icon the heading element carries `data-custom-icon-type="image"` and the core SVG is replaced in the save output.

The same attributes are registered on the PHP side through `block_type_metadata` so server-side validation matches the editor.

### Front end

`build/style-index.css` overrides the core panel's `display: none` with `display: block` for `[inert]` and `[aria-hidden="true"]` panels and sets `overflow: hidden; height: 0`, so the Interactivity API still handles accessibility while the panel stays in the layout. Transitions for `height`, `padding-top`, `padding-bottom` and `margin-block-start` are inside a `prefers-reduced-motion: no-preference` media query.

`js/frontend.js` reads the panel's natural padding and margin on load, snaps closed panels to zero without a transition, then watches each item with a `MutationObserver` and sets `height` to `scrollHeight` or `0` when the Interactivity API toggles `is-open`.

Both files are enqueued on every front-end page. When a page uses `accordion-animated/accordion-item` without any core accordion block, the plugin also enqueues the core accordion stylesheets, since WordPress would not load them on its own.

## Development

```bash
npm install
composer install        # also copies Plugin Update Checker into lib/

npm run start           # wp-scripts watch
npm run build           # production build to build/
npm run lint:js
npm run lint:css
npm run format
npm run test:unit       # Jest, save-output tests for both blocks
composer lint:php       # phpcs
composer lint:php-fix   # phpcbf
```

Jest stays on `wp-scripts test-unit-jest` with the configuration in `jest.config.cjs`; `@wordpress/block-editor` is replaced by the stub in `__mocks__/` so save functions can render without the full package.

CI (`.github/workflows/ci.yml`) runs `composer audit` and `composer lint:php` on PHP 8.0 through 8.4, and lint, build and unit tests on Node 22.

### Playground

`_playground/blueprint.json` installs the latest release zip plus Safe SVG and imports `_playground/demo.xml`. The badge at the top of this file opens it.

## Releases

Bump the version in `accordion-animated.php`, `package.json` and the `Stable tag` in `readme.txt`, add a changelog entry to both readme files, then push a lowercase `v` tag:

```bash
git tag v1.2.3 && git push origin v1.2.3
```

The tag has to be lowercase. Plugin Update Checker strips the prefix with a case-sensitive `ltrim()`, so an uppercase `V1.2.3` tag is never offered as an update, and the release workflow only matches `v[0-9]+.[0-9]+.[0-9]+`. Earlier tags in this repo are uppercase; they predate that rule.

The workflow (`.github/workflows/release.yml`) runs `npm ci`, `npm run build` and `npm run plugin-zip`, extracts the matching `= X.Y.Z =` block from `readme.txt` for the release notes, and attaches `accordion-animated.zip` and `readme.txt` to the GitHub release. The zip contains the paths listed under `files` in `package.json`.

## Limitations

- The front-end stylesheet and script load on every page, not only pages with an accordion.
- The animation depends on the core Accordion block's Interactivity API markup. A theme or plugin that replaces the core accordion's front-end behaviour will not get the transition.
- Custom icons are images only; `customIconChar` exists as an attribute but there is no inspector control for it.

## Changelog

### 1.2.4
- Fixed the update checker so it always installs the release zip, not whichever file GitHub lists first.
- Rewrote the readme files in plain English.

### 1.2.3
- Tested up to WordPress 7.1 and rebuilt with the current block editor toolchain.

### 1.2.2
- Fixed custom icon images not rendering in the block editor.
- Lowered the minimum WordPress version to 6.9.

### 1.2.1
- Fixed padding and margin animating on page load for panels that start closed.
- Removed the default block margin from Accordion Heading Extended.
- Removed the default toggle button padding inside Accordion Item Extended.

### 1.2.0
- Added a custom toggle icon option that takes an image from the media library.
- Added a toggle rotation setting: Default (45 degrees) or Invert (180 degrees).
- Added the Accordion Item Extended block (`accordion-animated/accordion-item`), an accordion item whose heading accepts inner blocks.
- Added the Accordion Heading Extended block (`accordion-animated/accordion-heading`), a heading built on inner blocks.
- Added block transforms between the core and extended item and heading blocks in both directions.

### 1.1.0
- Animated `padding-top`, `padding-bottom`, and `margin-block-start` together with `height`, so panels with block-support spacing collapse to zero.
- Added GitHub-based plugin updates through Plugin Update Checker 5.6.

### 1.0.0
- Initial release.

## License

GPL-2.0-or-later.

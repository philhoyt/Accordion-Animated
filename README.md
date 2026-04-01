# Accordion Animated

Adds animated open/close transitions to the core WordPress Accordion block.

## Description

Accordion Animated extends the core Accordion block with a CSS height transition. It uses block filters rather than registering a new block, so existing Accordion blocks are unaffected. Animation is opt-in per block and configured entirely through block attributes rendered as CSS custom properties.

## Features

- Enable or disable animation per Accordion block from the block inspector.
- Set animation duration between 100ms and 1000ms.
- Four easing options: Ease Out, Ease In Out, Linear, and Spring.
- No inline scripts. Animation state renders as CSS custom properties.
- Built on the WordPress Interactivity API that the core Accordion block uses.

## Requirements

- WordPress 6.9+
- PHP 8.0+

## Installation

1. Upload the plugin folder to `/wp-content/plugins/`, or install through the WordPress plugins screen.
2. Activate through the Plugins screen.
3. Select an Accordion block in the editor and enable **Animate open/close** in the Animation panel in the block inspector.

## Development

Install dependencies:
```bash
npm install
composer install
```

Available scripts:
```bash
npm run build          # Production build
npm run start          # Development build with watch
npm run lint:js        # Lint JavaScript
npm run lint:css       # Lint CSS/SCSS
composer lint:php      # Lint PHP
composer lint:php-fix  # Auto-fix PHP issues
```

## FAQ

**Does this replace the core Accordion block?**
No. It uses block filters to extend `core/accordion`. No new block is registered.

**Will this break existing Accordion blocks?**
No. Animation is off by default.

**Can I control the speed and easing?**
Yes. Set the duration in milliseconds and pick an easing curve from the block inspector.

## Changelog

### 1.1.0
- Animate `padding-top`, `padding-bottom`, and `margin-block-start` alongside `height` so panels with block-support spacing fully collapse to zero and expand smoothly.
- GitHub-based plugin updates via Plugin Update Checker (v5.6).

### 1.0.0
- Initial release.

## License

GPL-2.0-or-later. See [LICENSE](https://www.gnu.org/licenses/gpl-2.0.html).
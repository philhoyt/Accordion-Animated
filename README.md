# Accordion Animated

Adds animated open/close transitions and extended block enhancements to the core WordPress Accordion block.

## Description

Accordion Animated extends the core Accordion block with smooth CSS height transitions. Animation is opt-in per block and configured entirely through the block inspector. The plugin also provides two optional extended blocks — **Accordion Item Extended** and **Accordion Heading Extended** — that unlock rich block content inside the heading area and are fully interchangeable with core accordion blocks via block transforms.

## Features

- Enable or disable animation per Accordion block from the block inspector.
- Set animation duration between 100ms and 1000ms.
- Four easing options: Ease Out, Ease In Out, Linear, and Spring.
- Animation timing renders as CSS custom properties; height transitions are driven by a lightweight frontend script.
- Replace the default toggle icon with a custom image from the media library.
- Choose toggle icon rotation: Default (rotate 45°) or Invert (rotate 180°).
- **Accordion Item Extended** block — companion item with an unlocked heading area, usable wherever core accordion items are allowed.
- **Accordion Heading Extended** block — InnerBlocks-based heading supporting any block content (paragraphs, images, etc.).
- Block transforms between core and extended accordion variants in both directions.

## Requirements

- WordPress 7.0+
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
No. Block filters extend `core/accordion` and `core/accordion-heading` in place. The two extended blocks are entirely optional.

**Will this break existing Accordion blocks?**
No. Animation is off by default and all enhancements are opt-in.

**Can I control the speed and easing?**
Yes. Set the duration in milliseconds and pick an easing curve from the block inspector.

**What is the difference between the extended blocks and core accordion blocks?**
The core `core/accordion-heading` block stores heading text as a single rich-text field. The extended **Accordion Heading Extended** block uses InnerBlocks instead, so you can place any block — paragraphs, images, buttons — inside the heading area. Use **Accordion Item Extended** to insert an accordion item that contains an extended heading. Both variants are interchangeable via block transforms.

## Changelog

### 1.2.0
- New: Replace the default toggle icon with a custom image from the media library.
- New: Toggle animation direction — Default (rotate 45°) or Invert (rotate 180°).
- New: **Accordion Item Extended** block (`accordion-animated/accordion-item`) — companion accordion item with an open template and unlocked heading area.
- New: **Accordion Heading Extended** block (`accordion-animated/accordion-heading`) — InnerBlocks-based heading supporting rich block content.
- New: Block transforms between core and extended accordion item/heading variants in both directions.

### 1.1.0
- Animate `padding-top`, `padding-bottom`, and `margin-block-start` alongside `height` so panels with block-support spacing fully collapse to zero and expand smoothly.
- GitHub-based plugin updates via Plugin Update Checker (v5.6).

### 1.0.0
- Initial release.

## License

GPL-2.0-or-later. See [LICENSE](https://www.gnu.org/licenses/gpl-2.0.html).

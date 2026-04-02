=== Accordion Animated ===
Contributors: philhoyt
Tags: accordion, animation, block
Requires at least: 6.9
Tested up to: 7.0
Requires PHP: 8.0
Stable tag: 1.2.1
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Adds animated open/close transitions and extended block enhancements to the core WordPress Accordion block.

== Description ==

Accordion Animated extends the core Accordion block with a CSS height transition. Animation is opt-in per block and configured entirely through the block inspector. Two optional extended blocks, Accordion Item Extended and Accordion Heading Extended, unlock rich block content inside the heading area and are interchangeable with core accordion blocks via block transforms.

* Enable or disable animation per Accordion block from the block inspector.
* Set animation duration between 100ms and 1000ms.
* Four easing options: Ease Out, Ease In Out, Linear, and Spring.
* Animation timing renders as CSS custom properties; height transitions are driven by a lightweight frontend script.
* Replace the default toggle icon with a custom image from the media library.
* Choose toggle icon rotation: Default (rotate 45°) or Invert (rotate 180°).
* Accordion Item Extended block — companion item with an unlocked heading area, usable wherever core accordion items are allowed.
* Accordion Heading Extended block — InnerBlocks-based heading supporting any block content (paragraphs, images, etc.).
* Block transforms between core and extended accordion variants in both directions.

== Installation ==

1. Download the latest `accordion-animated.zip` from the [GitHub releases page](https://github.com/philhoyt/accordion-animated/releases).
2. Go to **Plugins → Add New → Upload Plugin** and upload the zip file.
3. Activate through the Plugins screen.
4. Select an Accordion block in the editor and enable **Animate open/close** in the Animation panel in the block inspector.

== Frequently Asked Questions ==

= Does this replace the core Accordion block? =

No. Block filters extend `core/accordion` and `core/accordion-heading` in place. The two extended blocks are entirely optional.

= Will this break existing Accordion blocks? =

No. Animation is off by default and all enhancements are opt-in.

= Can I control the speed and easing? =

Yes. Set the duration in milliseconds and pick an easing curve from the block inspector.

= What is the difference between the extended blocks and core accordion blocks? =

The core `accordion-heading` block stores heading text as a single rich-text field. Accordion Heading Extended uses InnerBlocks instead, so you can place any block inside the heading area. Use Accordion Item Extended to insert an accordion item that contains an extended heading. Both variants are interchangeable via block transforms.

== Changelog ==

= 1.2.1 =
* Fix: Prevent padding and margin from animating on page load for closed accordion panels.
* Fix: Remove default block margin from Accordion Heading Extended.
* Fix: Remove default toggle button padding inside Accordion Item Extended.

= 1.2.0 =
* New: Replace the default toggle icon with a custom image from the media library.
* New: Toggle animation direction — Default (rotate 45°) or Invert (rotate 180°).
* New: Accordion Item Extended block (accordion-animated/accordion-item) — companion accordion item with an open template and unlocked heading area.
* New: Accordion Heading Extended block (accordion-animated/accordion-heading) — InnerBlocks-based heading supporting rich block content.
* New: Block transforms between core and extended accordion item/heading variants in both directions.

= 1.1.0 =
* Animate padding-top, padding-bottom, and margin-block-start alongside height so panels with block-support spacing fully collapse to zero and expand smoothly.
* GitHub-based plugin updates via Plugin Update Checker (v5.6).

= 1.0.0 =
* Initial release.
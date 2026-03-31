=== Accordion Animated ===
Contributors: philhoyt
Tags: accordion, animation, block
Requires at least: 6.9
Tested up to: 6.9
Requires PHP: 8.0
Stable tag: 1.0.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Extends the core Accordion block with smooth, accessible open/close animation.

== Description ==

Accordion Animated adds a smooth height transition to the WordPress core Accordion block without replacing or re-registering it. Animation is opt-in per block — enable it in the block inspector and the panel opens and closes with a fluid animation driven by CSS custom properties.

**Features**

* Toggle animation on or off for each Accordion block independently.
* Control animation duration (100–1000ms) with a range slider.
* Choose from four easing curves: Ease Out, Ease In Out, Linear, and Spring.
* Animation state is stored in block attributes and rendered as CSS custom properties — no inline scripts.
* Works with the WordPress Interactivity API that powers the core Accordion block.

== Installation ==

1. Upload the plugin folder to the `/wp-content/plugins/` directory, or install the plugin through the WordPress plugins screen.
2. Activate the plugin through the Plugins screen in WordPress.
3. Open a page or post in the block editor, add or select an Accordion block, and enable **Animate open/close** in the block inspector under the Animation panel.

== Frequently Asked Questions ==

= Does this replace the core Accordion block? =

No. The plugin uses block filters to extend the existing core/accordion block. No custom block is registered.

= Will this break existing Accordion blocks? =

No. Animation is disabled by default. Existing blocks are unaffected unless you enable the toggle in the inspector.

= Can I control the speed and style of the animation? =

Yes. When animation is enabled, you can set the duration in milliseconds and choose an easing curve (Ease Out, Ease In Out, Linear, or Spring).

== Changelog ==

= 1.0.0 =
* Initial release.

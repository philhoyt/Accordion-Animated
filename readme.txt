=== Accordion Animated ===
Contributors: philhoyt
Tags: accordion, animation, block
Requires at least: 6.9
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 1.2.4
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Adds an open/close height animation and a custom toggle icon to the core Accordion block, plus an accordion heading that accepts any block

== Description ==

Accordion Animated extends the core Accordion block. It does not replace any core block; it adds settings to `core/accordion` and `core/accordion-heading` through block filters and registers two optional blocks of its own.

Animation is off until you turn it on for a given Accordion block. In the Animation panel of the block inspector you can:

* Turn on Animate open/close.
* Set the duration from 100 ms to 1000 ms in 50 ms steps.
* Pick an easing: Ease Out, Ease In Out, Linear, or Spring.

The duration and easing are written to the block as CSS custom properties. A small front-end script sets the panel height, so height, padding, and top margin transition together and the panel collapses to zero even when it has block-support spacing. The animation is skipped for visitors who have reduced motion set in their operating system.

On each Accordion Heading you can replace the default plus icon with an image from the media library, and choose whether the icon rotates 45 degrees (the default) or 180 degrees when the item opens.

The two extra blocks cover headings that need more than plain text:

* Accordion Item Extended works anywhere a core Accordion Item is allowed. It is a core item with a heading that accepts inner blocks.
* Accordion Heading Extended is the heading used inside it. Put paragraphs, images, or any other block in the heading area.

Block transforms convert between the core and extended item and heading in both directions.

== Installation ==

1. Download `accordion-animated.zip` from the [GitHub releases page](https://github.com/philhoyt/accordion-animated/releases).
2. Go to Plugins > Add New > Upload Plugin and upload the zip.
3. Activate the plugin on the Plugins screen.
4. Select an Accordion block, open the Animation panel in the block inspector, and turn on Animate open/close.

Updates come from GitHub releases through the bundled Plugin Update Checker.

== Frequently Asked Questions ==

= Does this change existing Accordion blocks? =

No. Animation is off by default and the toggle icon is the core one until you change it. Blocks you have not touched render as before.

= Why does the heading need a separate block? =

The core Accordion Heading stores its text as one rich-text field. Accordion Heading Extended uses inner blocks instead, so any block can go in the heading. Insert an Accordion Item Extended to get an item that already contains the extended heading, or transform an existing core item.

= Does the animation respect reduced-motion settings? =

Yes. The CSS transitions are wrapped in a `prefers-reduced-motion: no-preference` media query, so visitors who have asked for reduced motion get the panel opening and closing without a transition.

= Are the plugin's scripts loaded on every page? =

Yes. The front-end stylesheet and the height script are enqueued on every front-end page, whether or not the page contains an accordion.

== Changelog ==

= 1.2.4 =
* Fixed the update checker so it always installs the release zip, not whichever file GitHub lists first.
* Rewrote the readme files in plain English.

= 1.2.3 =
* Tested up to WordPress 7.1 and rebuilt with the current block editor toolchain.

= 1.2.2 =
* Fixed custom icon images not rendering in the block editor.
* Lowered the minimum WordPress version to 6.9.

= 1.2.1 =
* Fixed padding and margin animating on page load for panels that start closed.
* Removed the default block margin from Accordion Heading Extended.
* Removed the default toggle button padding inside Accordion Item Extended.

= 1.2.0 =
* Added a custom toggle icon option that takes an image from the media library.
* Added a toggle rotation setting: Default (45 degrees) or Invert (180 degrees).
* Added the Accordion Item Extended block (accordion-animated/accordion-item), an accordion item whose heading accepts inner blocks.
* Added the Accordion Heading Extended block (accordion-animated/accordion-heading), a heading built on inner blocks.
* Added block transforms between the core and extended item and heading blocks in both directions.

= 1.1.0 =
* Animated padding-top, padding-bottom, and margin-block-start together with height, so panels with block-support spacing collapse to zero.
* Added GitHub-based plugin updates through Plugin Update Checker 5.6.

= 1.0.0 =
* Initial release.

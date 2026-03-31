<?php
/**
 * Plugin Name:       Accordion Animated
 * Plugin URI:        https://github.com/philhoyt/accordion-animated
 * Description:       Extends the core Accordion block with smooth, accessible open/close animation.
 * Version:           1.0.0
 * Requires at least: 6.9
 * Requires PHP:      8.0
 * Author:            philhoyt
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       accordion-animated
 *
 * @package AccordionAnimated
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register custom attributes on core/accordion server-side so WordPress
 * does not strip them from saved post content on re-save.
 */
add_filter(
	'block_type_metadata',
	function ( array $metadata ): array {
		if ( ( $metadata['name'] ?? '' ) !== 'core/accordion' ) {
			return $metadata;
		}

		$metadata['attributes'] = array_merge(
			$metadata['attributes'] ?? [],
			[
				'animateTransition' => [
					'type'    => 'boolean',
					'default' => false,
				],
				'animationDuration' => [
					'type'    => 'integer',
					'default' => 300,
				],
				'animationEasing'   => [
					'type'    => 'string',
					'default' => 'ease-out',
				],
			]
		);

		return $metadata;
	}
);

/**
 * Enqueue editor JavaScript.
 * Uses build/index.asset.php for the auto-generated dependency array and
 * cache-busting version hash produced by @wordpress/scripts.
 */
add_action(
	'enqueue_block_editor_assets',
	function (): void {
		$asset_file = plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = require $asset_file;

		wp_enqueue_script(
			'accordion-animated-editor',
			plugin_dir_url( __FILE__ ) . 'build/index.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);
	}
);

/**
 * Enqueue animation CSS into the block editor canvas iframe.
 *
 * Must use enqueue_block_assets (not enqueue_block_editor_assets) so the
 * styles land inside the editor's iframe, not just the outer admin shell.
 * The is_admin() guard prevents this from running on the front end, where
 * wp_enqueue_scripts handles it separately below.
 */
add_action(
	'enqueue_block_assets',
	function (): void {
		if ( ! is_admin() ) {
			return;
		}

		$asset_file = plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = require $asset_file;

		wp_enqueue_style(
			'accordion-animated-editor',
			plugin_dir_url( __FILE__ ) . 'build/index.css',
			[],
			$asset['version']
		);
	}
);

/**
 * Enqueue animation CSS on the front end.
 *
 * Depends on wp-block-accordion so our override rules (which undo the core
 * panel's display:none) load after the core stylesheet.
 */
add_action(
	'wp_enqueue_scripts',
	function (): void {
		$asset_file = plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = require $asset_file;

		wp_enqueue_style(
			'accordion-animated',
			plugin_dir_url( __FILE__ ) . 'build/style-index.css',
			[ 'wp-block-accordion' ],
			$asset['version']
		);

		wp_enqueue_script(
			'accordion-animated-frontend',
			plugin_dir_url( __FILE__ ) . 'js/frontend.js',
			[],
			$asset['version'],
			true
		);
	}
);

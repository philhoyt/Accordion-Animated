<?php
/**
 * Plugin Name:       Accordion Animated
 * Plugin URI:        https://github.com/philhoyt/accordion-animated
 * Description:       Extends the core Accordion block with smooth, accessible open/close animation.
 * Version:           1.2.1
 * Requires at least: 7.0
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
 * Initialize Plugin Update Checker to enable GitHub-based updates.
 */
$puc_path = plugin_dir_path( __FILE__ ) . 'lib/plugin-update-checker/plugin-update-checker.php';
if ( file_exists( $puc_path ) ) {
	require_once $puc_path;

	$accordion_animated_update_checker = \YahnisElsts\PluginUpdateChecker\v5\PucFactory::buildUpdateChecker(
		'https://github.com/philhoyt/accordion-animated/',
		__FILE__,
		'accordion-animated'
	);
	$accordion_animated_update_checker->getVcsApi()->enableReleaseAssets();
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
 * Register custom toggle-icon attributes on core/accordion-heading server-side
 * so WordPress does not strip them from saved post content on re-save.
 */
add_filter(
	'block_type_metadata',
	function ( array $metadata ): array {
		if ( ( $metadata['name'] ?? '' ) !== 'core/accordion-heading' ) {
			return $metadata;
		}

		$metadata['attributes'] = array_merge(
			$metadata['attributes'] ?? [],
			[
				'customIconType' => [
					'type'    => 'string',
					'default' => 'default',
				],
				'customIconChar' => [
					'type'    => 'string',
					'default' => '',
				],
				'customIconUrl'    => [
					'type'    => 'string',
					'default' => '',
				],
				'customIconId'     => [
					'type'    => 'integer',
					'default' => 0,
				],
				'customIconWidth'  => [
					'type'    => 'integer',
					'default' => 0,
				],
				'customIconHeight'  => [
					'type'    => 'integer',
					'default' => 0,
				],
				'toggleAnimation'  => [
					'type'    => 'string',
					'default' => 'default',
				],
			]
		);

		return $metadata;
	}
);

/**
 * Render callback for accordion-animated/accordion-item.
 *
 * Mirrors block_core_accordion_item_render() exactly — uses WP_HTML_Tag_Processor
 * to inject all Interactivity API directives server-side so the toggle works
 * without any JavaScript changes.
 *
 * @param array  $attributes Block attributes.
 * @param string $content    Saved block HTML from InnerBlocks.
 * @return string Updated HTML with data-wp-* attributes injected.
 */
function accordion_animated_render_item( array $attributes, string $content ): string {
	if ( '' === $content ) {
		return $content;
	}

	$p         = new WP_HTML_Tag_Processor( $content );
	$unique_id = wp_unique_id( 'accordion-item-' );

	wp_interactivity_state(
		'core/accordion',
		array(
			'isOpen' => static function () {
				$context = wp_interactivity_get_context();
				return $context['openByDefault'];
			},
		)
	);

	if ( $p->next_tag( array( 'class_name' => 'wp-block-accordion-item' ) ) ) {
		$open_by_default = ! empty( $attributes['openByDefault'] ) ? 'true' : 'false';
		$p->set_attribute( 'data-wp-context', '{ "id": "' . $unique_id . '", "openByDefault": ' . $open_by_default . ' }' );
		$p->set_attribute( 'data-wp-class--is-open', 'state.isOpen' );
		$p->set_attribute( 'data-wp-init', 'callbacks.initAccordionItems' );
		$p->set_attribute( 'data-wp-on-window--hashchange', 'callbacks.hashChange' );

		if ( $p->next_tag( array( 'class_name' => 'wp-block-accordion-heading__toggle' ) ) ) {
			$p->set_attribute( 'data-wp-on--click', 'actions.toggle' );
			$p->set_attribute( 'data-wp-on--keydown', 'actions.handleKeyDown' );
			$p->set_attribute( 'id', $unique_id );
			$p->set_attribute( 'aria-controls', $unique_id . '-panel' );
			$p->set_attribute( 'data-wp-bind--aria-expanded', 'state.isOpen' );

			if ( $p->next_tag( array( 'class_name' => 'wp-block-accordion-panel' ) ) ) {
				$p->set_attribute( 'id', $unique_id . '-panel' );
				$p->set_attribute( 'aria-labelledby', $unique_id );
				$p->set_attribute( 'data-wp-bind--inert', '!state.isOpen' );

				$content = $p->get_updated_html();
			}
		}
	}

	if ( empty( $attributes['openByDefault'] ) ) {
		$processor = new WP_HTML_Tag_Processor( $content );
		while ( $processor->next_tag( 'IMG' ) ) {
			$processor->set_attribute( 'fetchpriority', 'low' );
		}
		$content = $processor->get_updated_html();
	}

	return $content;
}

/**
 * Register the accordion-animated/accordion-heading and
 * accordion-animated/accordion-item block types. Block metadata is read from
 * block.json in the respective build directories.
 */
add_action(
	'init',
	function (): void {
		$heading_json = plugin_dir_path( __FILE__ ) . 'build/accordion-heading/block.json';
		$item_json    = plugin_dir_path( __FILE__ ) . 'build/accordion-item/block.json';

		if ( file_exists( $heading_json ) ) {
			register_block_type( $heading_json );
		}

		if ( file_exists( $item_json ) ) {
			register_block_type(
				$item_json,
				array(
					'render_callback' => 'accordion_animated_render_item',
				)
			);
		}
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
 * When accordion-animated/accordion-item is used without any core accordion
 * blocks, WordPress won't load the core accordion stylesheet automatically.
 * Read the style handles directly from the registered core/accordion-item block
 * type and enqueue them so the accordion looks and works correctly.
 */
add_action(
	'wp_enqueue_scripts',
	function (): void {
		if ( ! has_block( 'accordion-animated/accordion-item' ) ) {
			return;
		}

		$registry = WP_Block_Type_Registry::get_instance();

		foreach ( [ 'core/accordion-item', 'core/accordion-heading', 'core/accordion-panel' ] as $block_name ) {
			$block_type = $registry->get_registered( $block_name );
			if ( ! $block_type ) {
				continue;
			}
			foreach ( $block_type->style_handles as $handle ) {
				wp_enqueue_style( $handle );
			}
		}
	},
	20
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


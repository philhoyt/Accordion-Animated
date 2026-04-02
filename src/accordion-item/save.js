/**
 * WordPress dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save() {
	// All data-wp-* Interactivity API attributes are injected server-side
	// by the accordion-animated/accordion-item render_callback in PHP,
	// mirroring what block_core_accordion_item_render does for core/accordion-item.
	return (
		<div
			{ ...useBlockProps.save( {
				className: 'wp-block-accordion-item',
			} ) }
		>
			<InnerBlocks.Content />
		</div>
	);
}

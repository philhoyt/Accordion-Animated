/**
 * WordPress dependencies
 */
import { registerBlockType, createBlock, cloneBlock } from '@wordpress/blocks';
import { accordionItem } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import Edit from './edit';
import save from './save';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'core/accordion-item' ],
			transform: ( attributes, innerBlocks ) => {
				// Convert any core/accordion-heading children to the animated variant.
				const convertedInnerBlocks = innerBlocks.map( ( block ) => {
					if ( block.name !== 'core/accordion-heading' ) {
						return cloneBlock( block );
					}
					const { title, level, iconPosition, showIcon } =
						block.attributes;
					return createBlock(
						'accordion-animated/accordion-heading',
						{ level, iconPosition, showIcon },
						title
							? [
									createBlock( 'core/paragraph', {
										content: title,
									} ),
							  ]
							: []
					);
				} );

				return createBlock(
					'accordion-animated/accordion-item',
					{ openByDefault: attributes.openByDefault },
					convertedInnerBlocks
				);
			},
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/accordion-item' ],
			transform: ( attributes, innerBlocks ) => {
				// Convert any accordion-animated/accordion-heading children back to core.
				const convertedInnerBlocks = innerBlocks.map( ( block ) => {
					if (
						block.name !== 'accordion-animated/accordion-heading'
					) {
						return cloneBlock( block );
					}
					const firstBlock = block.innerBlocks?.[ 0 ];
					const title = firstBlock?.attributes?.content ?? '';
					const { level, iconPosition, showIcon } = block.attributes;
					return createBlock( 'core/accordion-heading', {
						title,
						level,
						iconPosition,
						showIcon,
					} );
				} );

				return createBlock(
					'core/accordion-item',
					{ openByDefault: attributes.openByDefault },
					convertedInnerBlocks
				);
			},
		},
	],
};

registerBlockType( metadata, { edit: Edit, save, transforms, icon: accordionItem } );

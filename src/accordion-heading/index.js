/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { accordionHeading } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import Edit from './edit';
import save from './save';

registerBlockType( metadata, {
	edit: Edit,
	save,
	icon: accordionHeading,
} );

const { createElement } = require( '@wordpress/element' );

// Minimal mock for save-function testing. useBlockProps.save() returns the
// passed props so conditional data attributes appear in snapshot output.
const useBlockProps = {
	save: ( props = {} ) => props,
};

// InnerBlocks.Content renders a placeholder — enough for snapshot structure.
const InnerBlocks = () => null;
InnerBlocks.Content = () =>
	createElement( 'div', { className: 'inner-blocks' } );

module.exports = { useBlockProps, InnerBlocks };

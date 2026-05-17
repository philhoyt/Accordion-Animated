import { createElement } from '@wordpress/element';
import { renderToStaticMarkup } from 'react-dom/server.node';
import save from '../save';

const defaultAttributes = {
	level: 3,
	iconPosition: 'left',
	showIcon: true,
	customIconType: 'default',
	customIconChar: '',
	customIconUrl: '',
	customIconId: 0,
	customIconWidth: 0,
	customIconHeight: 0,
	toggleAnimation: 'default',
};

function render( attributes = {} ) {
	return renderToStaticMarkup(
		createElement( save, {
			attributes: { ...defaultAttributes, ...attributes },
		} )
	);
}

describe( 'accordion-heading save', () => {
	it( 'default attributes — no data attributes, + icon renders left', () => {
		expect( render() ).toMatchSnapshot();
	} );

	it( 'toggleAnimation invert — adds data-toggle-animation attribute', () => {
		expect( render( { toggleAnimation: 'invert' } ) ).toMatchSnapshot();
	} );

	it( 'custom image icon with URL — adds data-custom-icon-type and img tag', () => {
		expect(
			render( {
				customIconType: 'image',
				customIconUrl: 'https://example.com/icon.svg',
			} )
		).toMatchSnapshot();
	} );

	it( 'custom image icon with dimensions — applies aspect-ratio style', () => {
		expect(
			render( {
				customIconType: 'image',
				customIconUrl: 'https://example.com/icon.svg',
				customIconWidth: 24,
				customIconHeight: 24,
			} )
		).toMatchSnapshot();
	} );

	it( 'invert animation + custom image icon — both data attributes present', () => {
		expect(
			render( {
				toggleAnimation: 'invert',
				customIconType: 'image',
				customIconUrl: 'https://example.com/icon.svg',
			} )
		).toMatchSnapshot();
	} );

	it( 'showIcon false — no icon span', () => {
		expect( render( { showIcon: false } ) ).toMatchSnapshot();
	} );

	it( 'iconPosition right — icon renders after title', () => {
		expect( render( { iconPosition: 'right' } ) ).toMatchSnapshot();
	} );
} );

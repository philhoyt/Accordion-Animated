import { createElement } from '@wordpress/element';
import { renderToStaticMarkup } from 'react-dom/server.node';
import save from '../save';

describe( 'accordion-item save', () => {
	it( 'renders wrapper div with wp-block-accordion-item class', () => {
		expect(
			renderToStaticMarkup( createElement( save, {} ) )
		).toMatchSnapshot();
	} );
} );

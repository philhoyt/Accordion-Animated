/* global MutationObserver */
( function () {
	function initAccordion( accordion ) {
		accordion
			.querySelectorAll( '.wp-block-accordion-item' )
			.forEach( function ( item ) {
				const panel = item.querySelector( '.wp-block-accordion-panel' );
				if ( ! panel ) {
					return;
				}

				// Set the correct height on load based on current open state.
				panel.style.height = item.classList.contains( 'is-open' )
					? panel.scrollHeight + 'px'
					: '0px';

				// Watch for the Interactivity API toggling .is-open and update height.
				new MutationObserver( function () {
					panel.style.height = item.classList.contains( 'is-open' )
						? panel.scrollHeight + 'px'
						: '0px';
				} ).observe( item, {
					attributes: true,
					attributeFilter: [ 'class' ],
				} );
			} );
	}

	function init() {
		document
			.querySelectorAll( '.wp-block-accordion.has-animation' )
			.forEach( initAccordion );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();

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

				// Capture natural padding and margin before any style overrides.
				const computed = window.getComputedStyle( panel );
				const naturalPaddingTop = computed.paddingTop;
				const naturalPaddingBottom = computed.paddingBottom;
				const naturalMarginBlockStart = computed.marginBlockStart;

				// Set the correct state on load based on current open state.
				if ( item.classList.contains( 'is-open' ) ) {
					panel.style.paddingTop = naturalPaddingTop;
					panel.style.paddingBottom = naturalPaddingBottom;
					panel.style.marginBlockStart = naturalMarginBlockStart;
					panel.style.height = panel.scrollHeight + 'px';
				} else {
					// Suppress transition so the initial snap-to-closed doesn't animate.
					panel.style.transition = 'none';
					panel.style.paddingTop = '0px';
					panel.style.paddingBottom = '0px';
					panel.style.marginBlockStart = '0px';
					panel.style.height = '0px';
					// Force a reflow to commit the values before re-enabling transition.
					panel.getBoundingClientRect(); // eslint-disable-line no-unused-expressions
					panel.style.transition = '';
				}

				// Watch for the Interactivity API toggling .is-open and update height.
				new MutationObserver( function () {
					if ( item.classList.contains( 'is-open' ) ) {
						// Restore padding and margin first so scrollHeight includes padding.
						panel.style.paddingTop = naturalPaddingTop;
						panel.style.paddingBottom = naturalPaddingBottom;
						panel.style.marginBlockStart = naturalMarginBlockStart;
						panel.style.height = panel.scrollHeight + 'px';
					} else {
						panel.style.height = '0px';
						panel.style.paddingTop = '0px';
						panel.style.paddingBottom = '0px';
						panel.style.marginBlockStart = '0px';
					}
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

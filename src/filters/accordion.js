/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	SelectControl,
} from '@wordpress/components';
import { cloneElement } from '@wordpress/element';

const EASING_OPTIONS = [
	{
		label: __( 'Ease Out', 'accordion-animated' ),
		value: 'ease-out',
	},
	{
		label: __( 'Ease In Out', 'accordion-animated' ),
		value: 'ease-in-out',
	},
	{
		label: __( 'Linear', 'accordion-animated' ),
		value: 'linear',
	},
	{
		label: __( 'Spring', 'accordion-animated' ),
		value: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
	},
];

/**
 * Filter 1: Add animateTransition, animationDuration, and animationEasing
 * attributes to the core/accordion block.
 *
 * These must match the attribute definitions in accordion-animated.php's
 * block_type_metadata filter so WordPress doesn't strip them on re-save.
 */
addFilter(
	'blocks.registerBlockType',
	'accordion-animated/add-attributes',
	( settings, name ) => {
		if ( name !== 'core/accordion' ) {
			return settings;
		}

		return {
			...settings,
			attributes: {
				...settings.attributes,
				animateTransition: {
					type: 'boolean',
					default: false,
				},
				animationDuration: {
					type: 'integer',
					default: 300,
				},
				animationEasing: {
					type: 'string',
					default: 'ease-out',
				},
			},
		};
	}
);

/**
 * Filter 2: Add an "Animation" panel to the core/accordion Inspector Controls.
 *
 * Uses createHigherOrderComponent to wrap BlockEdit. The core block's existing
 * inspector panels are preserved — we append ours after them.
 */
addFilter(
	'editor.BlockEdit',
	'accordion-animated/with-animation-controls',
	createHigherOrderComponent( ( BlockEdit ) => {
		return function AccordionAnimatedEdit( props ) {
			if ( props.name !== 'core/accordion' ) {
				return <BlockEdit { ...props } />;
			}

			const { attributes, setAttributes } = props;
			const { animateTransition, animationDuration, animationEasing } =
				attributes;

			return (
				<>
					<BlockEdit { ...props } />
					<InspectorControls>
						<PanelBody
							title={ __( 'Animation', 'accordion-animated' ) }
							initialOpen={ false }
						>
							<ToggleControl
								label={ __(
									'Animate open/close',
									'accordion-animated'
								) }
								checked={ animateTransition }
								onChange={ ( value ) =>
									setAttributes( {
										animateTransition: value,
									} )
								}
								help={ __(
									'Smooth animation when panels expand and collapse.',
									'accordion-animated'
								) }
							/>
							{ animateTransition && (
								<>
									<RangeControl
										label={ __(
											'Duration (ms)',
											'accordion-animated'
										) }
										value={ animationDuration }
										onChange={ ( value ) =>
											setAttributes( {
												animationDuration: value,
											} )
										}
										min={ 100 }
										max={ 1000 }
										step={ 50 }
									/>
									<SelectControl
										label={ __(
											'Easing',
											'accordion-animated'
										) }
										value={ animationEasing }
										options={ EASING_OPTIONS }
										onChange={ ( value ) =>
											setAttributes( {
												animationEasing: value,
											} )
										}
									/>
								</>
							) }
						</PanelBody>
					</InspectorControls>
				</>
			);
		};
	}, 'withAccordionAnimationControls' )
);

/**
 * Filter 3: Inject has-animation class and CSS custom properties into the
 * saved HTML when animation is enabled.
 *
 * The resulting markup looks like:
 *   <div class="wp-block-accordion has-animation"
 *        style="--animation-duration:300ms; --animation-easing:ease-out">
 *
 * style.scss reads these custom properties to drive the transition timing.
 * Blocks without animateTransition are returned completely unchanged.
 */
addFilter(
	'blocks.getSaveElement',
	'accordion-animated/save-element',
	( element, blockType, attributes ) => {
		if ( blockType.name !== 'core/accordion' ) {
			return element;
		}

		if ( ! attributes.animateTransition ) {
			return element;
		}

		const { animationDuration, animationEasing } = attributes;

		return cloneElement( element, {
			className: [ element.props?.className, 'has-animation' ]
				.filter( Boolean )
				.join( ' ' ),
			style: {
				...element.props?.style,
				'--animation-duration': `${ animationDuration }ms`,
				'--animation-easing': animationEasing,
			},
		} );
	}
);

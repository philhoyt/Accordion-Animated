/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	SelectControl,
	RadioControl,
	Button,
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
 * Filter 2: Add customIconType, customIconChar, customIconUrl, and customIconId
 * attributes to the core/accordion-heading block.
 *
 * These must match the attribute definitions in accordion-animated.php's
 * block_type_metadata filter so WordPress doesn't strip them on re-save.
 */
addFilter(
	'blocks.registerBlockType',
	'accordion-animated/add-heading-attributes',
	( settings, name ) => {
		if ( name !== 'core/accordion-heading' ) {
			return settings;
		}

		return {
			...settings,
			attributes: {
				...settings.attributes,
				customIconType: {
					type: 'string',
					default: 'default',
				},
				customIconChar: {
					type: 'string',
					default: '',
				},
				customIconUrl: {
					type: 'string',
					default: '',
				},
				customIconId: {
					type: 'integer',
					default: 0,
				},
				customIconWidth: {
					type: 'integer',
					default: 0,
				},
				customIconHeight: {
					type: 'integer',
					default: 0,
				},
				toggleAnimation: {
					type: 'string',
					default: 'default',
				},
			},
		};
	}
);

/**
 * Filter 3: Add an "Animation" panel to the core/accordion Inspector Controls.
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
 * Filter 4: Add a "Toggle Icon" panel to the core/accordion-heading Inspector Controls.
 *
 * Allows replacing the default SVG toggle icon with a custom character or image.
 */
addFilter(
	'editor.BlockEdit',
	'accordion-animated/with-heading-icon-controls',
	createHigherOrderComponent( ( BlockEdit ) => {
		return function AccordionHeadingIconEdit( props ) {
			if ( props.name !== 'core/accordion-heading' ) {
				return <BlockEdit { ...props } />;
			}

			const { attributes, setAttributes } = props;
			const {
				customIconType,
				customIconUrl,
				customIconId,
				toggleAnimation,
			} = attributes;

			return (
				<>
					<BlockEdit { ...props } />
					<InspectorControls group="styles">
						<PanelBody
							title={ __( 'Toggle Icon', 'accordion-animated' ) }
							initialOpen={ false }
						>
							<div style={ { marginBottom: '16px' } }>
								<RadioControl
									label={ __(
										'Icon type',
										'accordion-animated'
									) }
									selected={ customIconType || 'default' }
									options={ [
										{
											label: __(
												'Default',
												'accordion-animated'
											),
											value: 'default',
										},
										{
											label: __(
												'Image',
												'accordion-animated'
											),
											value: 'image',
										},
									] }
									onChange={ ( value ) =>
										setAttributes( {
											customIconType: value,
										} )
									}
								/>
								{ customIconType === 'image' && (
									<MediaUploadCheck>
										<MediaUpload
											onSelect={ ( media ) =>
												setAttributes( {
													customIconUrl: media.url,
													customIconId: media.id,
													customIconWidth:
														media.width ?? 0,
													customIconHeight:
														media.height ?? 0,
												} )
											}
											allowedTypes={ [ 'image' ] }
											value={ customIconId }
											render={ ( { open } ) => (
												<div>
													{ customIconUrl && (
														<img
															src={
																customIconUrl
															}
															alt=""
															style={ {
																display:
																	'block',
																maxWidth:
																	'4rem',
																marginBottom:
																	'0.5rem',
															} }
														/>
													) }
													<Button
														variant="secondary"
														onClick={ open }
													>
														{ customIconUrl
															? __(
																	'Replace image',
																	'accordion-animated'
															  )
															: __(
																	'Select image',
																	'accordion-animated'
															  ) }
													</Button>
													{ customIconUrl && (
														<Button
															variant="link"
															isDestructive
															onClick={ () =>
																setAttributes( {
																	customIconUrl:
																		'',
																	customIconId: 0,
																	customIconWidth: 0,
																	customIconHeight: 0,
																} )
															}
															style={ {
																marginLeft:
																	'0.5rem',
															} }
														>
															{ __(
																'Remove',
																'accordion-animated'
															) }
														</Button>
													) }
												</div>
											) }
										/>
									</MediaUploadCheck>
								) }
							</div>
							<RadioControl
								label={ __(
									'Open animation',
									'accordion-animated'
								) }
								selected={ toggleAnimation || 'default' }
								options={ [
									{
										label: __(
											'Default (rotate 45°)',
											'accordion-animated'
										),
										value: 'default',
									},
									{
										label: __(
											'Invert (rotate 180°)',
											'accordion-animated'
										),
										value: 'invert',
									},
								] }
								onChange={ ( value ) =>
									setAttributes( { toggleAnimation: value } )
								}
							/>
						</PanelBody>
					</InspectorControls>
				</>
			);
		};
	}, 'withAccordionHeadingIconControls' )
);

/**
 * Filter 5: Inject has-animation class and CSS custom properties into the
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

/**
 * Recursively traverses a React element tree and replaces the children of
 * .wp-block-accordion-heading__toggle-icon with customContent, removing the
 * default SVG from the saved HTML entirely. iconProps are merged into the
 * toggle icon element itself (e.g. to set an inline aspect-ratio style).
 *
 * @param {*}      element       React element to traverse.
 * @param {*}      customContent Replacement child (element or null).
 * @param {Object} iconProps     Extra props to apply to the toggle icon span.
 * @return {*} The element with the toggle icon updated.
 */
function injectCustomIcon( element, customContent, iconProps = {} ) {
	if ( ! element || typeof element !== 'object' || ! element.props ) {
		return element;
	}

	const { className, children } = element.props;

	if (
		typeof className === 'string' &&
		className
			.split( ' ' )
			.includes( 'wp-block-accordion-heading__toggle-icon' )
	) {
		return cloneElement( element, iconProps, customContent );
	}

	if ( children === undefined || children === null ) {
		return element;
	}

	const processChild = ( child ) =>
		injectCustomIcon( child, customContent, iconProps );

	if ( Array.isArray( children ) ) {
		return cloneElement( element, {}, ...children.map( processChild ) );
	}

	return cloneElement( element, {}, processChild( children ) );
}

/**
 * Filter 6: Replace the default SVG in the toggle icon span with the user's
 * custom icon when one is configured on core/accordion-heading.
 *
 * For character icons, a <span aria-hidden="true"> containing the character is
 * injected directly into the toggle icon span, removing the SVG from the DOM.
 *
 * For image icons, an <img> element is injected in place of the SVG.
 *
 * The <h3> also receives data-custom-icon-type so style.scss can adjust layout.
 * Headings using the default icon are returned completely unchanged.
 */
addFilter(
	'blocks.getSaveElement',
	'accordion-animated/save-heading-element',
	( element, blockType, attributes ) => {
		if ( blockType.name !== 'core/accordion-heading' ) {
			return element;
		}

		const {
			customIconType,
			customIconUrl,
			customIconWidth,
			customIconHeight,
			toggleAnimation,
		} = attributes;

		const hasCustomIcon = customIconType === 'image' && customIconUrl;
		const hasInvertAnimation = toggleAnimation === 'invert';

		if ( ! hasCustomIcon && ! hasInvertAnimation ) {
			return element;
		}

		// Props applied to the <h3> heading element.
		const headingProps = {};
		if ( hasCustomIcon ) {
			headingProps[ 'data-custom-icon-type' ] = 'image';
		}
		if ( hasInvertAnimation ) {
			headingProps[ 'data-toggle-animation' ] = 'invert';
		}

		// If no custom icon content is needed, just tag the heading and return.
		if ( ! hasCustomIcon ) {
			return cloneElement( element, headingProps );
		}

		let iconProps = {};

		const customContent = (
			<img src={ customIconUrl } alt="" aria-hidden="true" />
		);
		if ( customIconWidth && customIconHeight ) {
			iconProps = {
				style: {
					aspectRatio: `${ customIconWidth } / ${ customIconHeight }`,
					width: '28px',
				},
			};
		}

		return injectCustomIcon(
			cloneElement( element, headingProps ),
			customContent,
			iconProps
		);
	}
);

/**
 * Filter 7: Add data attributes to the block wrapper in the editor so that
 * editor.scss can preview the custom icon without touching the saved markup.
 */
addFilter(
	'editor.BlockListBlock',
	'accordion-animated/heading-icon-preview',
	createHigherOrderComponent( ( BlockListBlock ) => {
		return function AccordionHeadingIconPreview( props ) {
			if ( props.name !== 'core/accordion-heading' ) {
				return <BlockListBlock { ...props } />;
			}

			const { attributes } = props;
			const {
				customIconType,
				customIconUrl,
				customIconWidth,
				customIconHeight,
			} = attributes;

			if ( customIconType !== 'image' || ! customIconUrl ) {
				return <BlockListBlock { ...props } />;
			}

			const wrapperStyle = { ...( props.wrapperProps?.style || {} ) };

			wrapperStyle[ '--custom-icon-url' ] = `url("${ customIconUrl }")`;
			if ( customIconWidth && customIconHeight ) {
				wrapperStyle[
					'--custom-icon-aspect-ratio'
				] = `${ customIconWidth } / ${ customIconHeight }`;
				wrapperStyle[ '--custom-icon-width' ] = '28px';
			}

			const wrapperProps = {
				...( props.wrapperProps || {} ),
				'data-custom-icon-type': customIconType,
				style: wrapperStyle,
			};

			return (
				<BlockListBlock { ...props } wrapperProps={ wrapperProps } />
			);
		};
	}, 'withAccordionHeadingIconPreview' )
);

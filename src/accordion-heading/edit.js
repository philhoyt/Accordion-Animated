/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { PanelBody, RadioControl, Button } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';

export default function Edit( { attributes, setAttributes, context } ) {
	const {
		iconPosition,
		showIcon,
		customIconType,
		customIconUrl,
		customIconId,
		toggleAnimation,
	} = attributes;

	const contextIconPosition = context?.[ 'core/accordion-icon-position' ];
	const contextShowIcon = context?.[ 'core/accordion-show-icon' ];
	const contextLevel = context?.[ 'core/accordion-heading-level' ];
	const TagName = `h${ contextLevel || 3 }`;

	const { __unstableMarkNextChangeAsNotPersistent } =
		useDispatch( blockEditorStore );

	// Sync icon position, show icon, and heading level down from accordion context.
	useEffect( () => {
		if (
			contextIconPosition !== undefined &&
			contextShowIcon !== undefined
		) {
			__unstableMarkNextChangeAsNotPersistent();
			setAttributes( {
				iconPosition: contextIconPosition,
				showIcon: contextShowIcon,
			} );
		}
	}, [
		contextIconPosition,
		contextShowIcon,
		setAttributes,
		__unstableMarkNextChangeAsNotPersistent,
	] );

	const blockProps = useBlockProps( {
		className: 'wp-block-accordion-heading',
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'wp-block-accordion-heading__toggle-title' },
		{
			template: [
				[
					'core/paragraph',
					{
						placeholder: __(
							'Accordion title…',
							'accordion-animated'
						),
					},
				],
			],
			templateLock: false,
		}
	);

	// Resolve the icon element for the editor preview.
	let iconContent = '+';
	if ( customIconType === 'image' && customIconUrl ) {
		iconContent = <img src={ customIconUrl } alt="" aria-hidden="true" />;
	}

	const resolvedShowIcon = contextShowIcon ?? showIcon;
	const resolvedIconPos = contextIconPosition ?? iconPosition;

	const toggleIconSpan = (
		<span
			className="wp-block-accordion-heading__toggle-icon"
			aria-hidden="true"
		>
			{ iconContent }
		</span>
	);

	return (
		<>
			<TagName { ...blockProps }>
				<button
					className="wp-block-accordion-heading__toggle"
					tabIndex="-1"
				>
					{ resolvedShowIcon &&
						resolvedIconPos === 'left' &&
						toggleIconSpan }
					<span { ...innerBlocksProps } />
					{ resolvedShowIcon &&
						resolvedIconPos === 'right' &&
						toggleIconSpan }
				</button>
			</TagName>

			<InspectorControls group="styles">
				<PanelBody
					title={ __( 'Toggle Icon', 'accordion-animated' ) }
					initialOpen={ false }
				>
					<div style={ { marginBottom: '16px' } }>
						<RadioControl
							label={ __( 'Icon type', 'accordion-animated' ) }
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
									label: __( 'Image', 'accordion-animated' ),
									value: 'image',
								},
							] }
							onChange={ ( value ) =>
								setAttributes( { customIconType: value } )
							}
						/>
						{ customIconType === 'image' && (
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) =>
										setAttributes( {
											customIconUrl: media.url,
											customIconId: media.id,
											customIconWidth: media.width ?? 0,
											customIconHeight: media.height ?? 0,
										} )
									}
									allowedTypes={ [ 'image' ] }
									value={ customIconId }
									render={ ( { open } ) => (
										<div>
											{ customIconUrl && (
												<img
													src={ customIconUrl }
													alt=""
													style={ {
														display: 'block',
														maxWidth: '4rem',
														marginBottom: '0.5rem',
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
															customIconUrl: '',
															customIconId: 0,
															customIconWidth: 0,
															customIconHeight: 0,
														} )
													}
													style={ {
														marginLeft: '0.5rem',
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
						label={ __( 'Open animation', 'accordion-animated' ) }
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
}

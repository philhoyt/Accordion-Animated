/**
 * WordPress dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const {
		level,
		iconPosition,
		showIcon,
		customIconType,
		customIconChar,
		customIconUrl,
		customIconWidth,
		customIconHeight,
		toggleAnimation,
	} = attributes;

	const TagName = `h${ level || 3 }`;

	// Data attributes for CSS animation and icon targeting.
	const headingDataProps = {};
	if ( customIconType && customIconType !== 'default' ) {
		headingDataProps[ 'data-custom-icon-type' ] = customIconType;
	}
	if ( toggleAnimation === 'invert' ) {
		headingDataProps[ 'data-toggle-animation' ] = 'invert';
	}

	const blockProps = useBlockProps.save( {
		className: 'wp-block-accordion-heading',
		...headingDataProps,
	} );

	// Build the icon element.
	let iconContent = '+';
	const iconSpanProps = {};

	if ( customIconType === 'character' && customIconChar ) {
		iconContent = <span aria-hidden="true">{ customIconChar }</span>;
	} else if ( customIconType === 'image' && customIconUrl ) {
		iconContent = <img src={ customIconUrl } alt="" aria-hidden="true" />;
		if ( customIconWidth && customIconHeight ) {
			iconSpanProps.style = {
				aspectRatio: `${ customIconWidth } / ${ customIconHeight }`,
				width: '28px',
			};
		}
	}

	const toggleIconSpan = showIcon ? (
		<span
			className="wp-block-accordion-heading__toggle-icon"
			aria-hidden="true"
			{ ...iconSpanProps }
		>
			{ iconContent }
		</span>
	) : null;

	return (
		<TagName { ...blockProps }>
			<button
				type="button"
				className="wp-block-accordion-heading__toggle"
			>
				{ showIcon && iconPosition === 'left' && toggleIconSpan }
				<span className="wp-block-accordion-heading__toggle-title">
					<InnerBlocks.Content />
				</span>
				{ showIcon && iconPosition === 'right' && toggleIconSpan }
			</button>
		</TagName>
	);
}

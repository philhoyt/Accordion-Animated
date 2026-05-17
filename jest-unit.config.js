const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/jest-unit.config' );

module.exports = {
	...defaultConfig,
	moduleNameMapper: {
		...( defaultConfig.moduleNameMapper || {} ),
		// @wordpress/block-editor is a WordPress runtime external (not in node_modules).
		// Use a minimal manual mock so save-function tests can render without the full package.
		'^@wordpress/block-editor$': path.resolve(
			__dirname,
			'__mocks__/@wordpress/block-editor.js'
		),
	},
};

/**
 * Jest configuration.
 *
 * `@wordpress/scripts` 36 moved test-unit-js to Vitest and stopped shipping
 * Jest defaults. This keeps the existing Jest suite on the published
 * WordPress preset, per the scripts package's vitest-migration guide
 * ("Keep an existing Jest suite").
 */
const path = require( 'path' );
const preset = require( '@wordpress/jest-preset-default/jest-preset' );

module.exports = {
	preset: '@wordpress/jest-preset-default',
	transform: {
		'\\.[jt]sx?$': [
			'babel-jest',
			{ presets: [ '@wordpress/babel-preset-default' ] },
		],
	},
	moduleNameMapper: {
		...preset.moduleNameMapper,
		// @wordpress/block-editor is a WordPress runtime external (not in node_modules).
		// Use a minimal manual mock so save-function tests can render without the full package.
		'^@wordpress/block-editor$': path.resolve(
			__dirname,
			'__mocks__/@wordpress/block-editor.js'
		),
	},
};

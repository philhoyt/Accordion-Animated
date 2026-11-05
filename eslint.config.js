/* eslint-disable import/no-extraneous-dependencies */
const wpPlugin = require( '@wordpress/eslint-plugin' );
const jestPlugin = require( 'eslint-plugin-jest' );
/* eslint-enable import/no-extraneous-dependencies */

module.exports = [
	{ ignores: [ 'build/**', 'vendor/**', 'node_modules/**', 'lib/**' ] },
	...wpPlugin.configs.recommended,
	// The unit suite stays on Jest (wp-scripts test-unit-jest); the default
	// test override in @wordpress/eslint-plugin 27+ targets Vitest instead.
	{
		...jestPlugin.configs[ 'flat/recommended' ],
		files: [ '**/@(test|__tests__)/**/*.js', '**/?(*.)test.js' ],
	},
	{
		rules: {
			// @wordpress/* packages are WordPress runtime externals provided by the host
			// environment, not local npm packages. Webpack resolves them at build time.
			'import/no-unresolved': [ 'error', { ignore: [ '^@wordpress/' ] } ],
		},
	},
];

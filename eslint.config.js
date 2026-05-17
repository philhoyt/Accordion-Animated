/* eslint-disable import/no-extraneous-dependencies */
const wpPlugin = require( '@wordpress/eslint-plugin' );
/* eslint-enable import/no-extraneous-dependencies */

module.exports = [
	{ ignores: [ 'build/**', 'vendor/**', 'node_modules/**', 'lib/**' ] },
	...wpPlugin.configs.recommended,
	// Apply Jest globals to test files.
	...wpPlugin.configs[ 'test-unit' ].map( ( c ) => ( {
		...c,
		files: [ '**/@(test|__tests__)/**/*.js', '**/?(*.)test.js' ],
	} ) ),
	{
		rules: {
			// @wordpress/* packages are WordPress runtime externals provided by the host
			// environment, not local npm packages. Webpack resolves them at build time.
			'import/no-unresolved': [ 'error', { ignore: [ '^@wordpress/' ] } ],
		},
	},
];

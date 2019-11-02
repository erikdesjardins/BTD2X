/* eslint-disable import/no-commonjs, import/no-nodejs-modules */

const path = require('path');

const InertEntryPlugin = require('inert-entry-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = (env = {}, argv = {}) => {
	const zip = env.zip || false;
	const production = argv.mode === 'production';
	return {
		entry: 'extricate-loader!interpolate-loader!./src/manifest.json',
		output: {
			path: path.join(__dirname, 'dist'),
			filename: 'manifest.json',
		},
		module: {
			rules: [{
				test: /\.entry\.js$/,
				use: [
					{ loader: 'file-loader', options: { name: '[name].js' } },
					{ loader: 'webpack-rollup-loader' },
				],
			}, {
				test: /\.js$/,
				use: [
					{ loader: 'babel-loader', options: { comments: !production } },
				],
			}, {
				test: /\.(png)$/,
				use: [
					{ loader: 'file-loader', options: { name: '[name].[ext]' } },
				],
			}],
		},
		optimization: {
			minimize: false,
			concatenateModules: true,
		},
		plugins: [
			new InertEntryPlugin(),
			(zip && new ZipPlugin({ filename: 'BTD2X.zip' })),
		].filter(x => x),
	};
};

const path = require('path');

const InertEntryPlugin = require('inert-entry-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = ({ production = false, zip = false }) => ({
	entry: 'extricate-loader!interpolate-loader!./src/manifest.json',
	bail: production,
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
			test: /\.(png)$/,
			use: [
				{ loader: 'file-loader', options: { name: '[name].[ext]' } },
			],
		}],
	},
	plugins: [
		new ProgressBarPlugin(),
		new InertEntryPlugin(),
		(zip && new ZipPlugin({ filename: 'no-emoji.zip' })),
	].filter(x => x),
});

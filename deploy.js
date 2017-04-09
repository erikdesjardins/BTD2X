/* eslint-disable import/no-nodejs-modules, import/no-commonjs, strict, no-console */

'use strict';

const fs = require('fs');
const path = require('path');
const deployChrome = require('chrome-extension-deploy');
const deployFirefox = require('firefox-extension-deploy');
const manifest = require('./dist/manifest.json');

deployChrome({
	clientId: process.env.CHROME_CLIENT_ID,
	clientSecret: process.env.CHROME_CLIENT_SECRET,
	refreshToken: process.env.CHROME_REFRESH_TOKEN,
	id: 'obbjmeopodlheliibjoabgbmchpecjaj',
	zip: fs.readFileSync(path.join(__dirname, 'dist/BTD2X.zip')),
}).then(() => {
	console.log('Chrome deploy complete!');
}, err => {
	console.error('Chrome failed:', err);
	process.exitCode = 1;
});

deployFirefox({
	issuer: process.env.FIREFOX_ISSUER,
	secret: process.env.FIREFOX_SECRET,
	id: manifest.applications.gecko.id,
	version: manifest.version,
	src: fs.createReadStream(path.join(__dirname, 'dist/BTD2X.zip')),
}).then(() => {
	console.log('Firefox deploy complete!');
}, err => {
	console.error('Firefox failed:', err);
	process.exitCode = 1;
});

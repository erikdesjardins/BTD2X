/* eslint-disable import/no-nodejs-modules, import/no-commonjs, strict, no-console */

'use strict';

const fs = require('fs');
const path = require('path');
const deployChrome = require('chrome-extension-deploy');

deployChrome({
	clientId: process.env.CHROME_CLIENT_ID,
	clientSecret: process.env.CHROME_CLIENT_SECRET,
	refreshToken: process.env.CHROME_REFRESH_TOKEN,
	id: 'ondleggdphnnaplocdmmpjfcmfcoggli',
	zip: fs.readFileSync(path.join(__dirname, 'dist/BTD2X.zip')),
}).then(() => {
	console.log('Chrome deploy complete!');
}, err => {
	console.error('Chrome failed:', err);
	process.exitCode = 1;
});

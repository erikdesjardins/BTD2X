/* @flow */

import { get, set } from '../browser/isomorphic/storage';
import { create } from '../browser/foreground/contextMenus';

const ACCOUNTS_KEY = 'accountSwitcher-accounts';

(async function init() {
	const accounts = await get(ACCOUNTS_KEY, ([]: Array<{| username: string, password: string |}>));

	// top-level menu item
	create({
		id: 'accounts',
		title: 'switch accounts',
		contexts: ['link'],
		// the userbar link has a trailing slash, unlike most user links (luckily)
		targetUrlPatterns: ['https://*.reddit.com/login', 'https://*.reddit.com/user/*/'],
	});

	// "switch to $account"
	for (const { username, password } of accounts) {
		create({
			id: `accounts-account_${username}`,
			parentId: 'accounts',
			contexts: ['link'],
			title: `switch to ${username}`,
		}, async () => {
			const modhashElement: ?HTMLInputElement = (document.querySelector('[name=uh]'): any);
			if (modhashElement) {
				await fetch('/logout', {
					method: 'POST',
					credentials: 'include',
					headers: { 'X-Modhash': modhashElement.value },
				});
			}

			await fetch('/api/login', {
				method: 'POST',
				body: new URLSearchParams(`user=${username}&passwd=${password}`),
				credentials: 'include',
			});

			location.reload();
		});
	}

	// separator
	if (accounts.length) {
		create({
			id: 'accounts-separator1',
			parentId: 'accounts',
			type: 'separator',
			contexts: ['link'],
		});
	}

	// "add account"
	create({
		id: 'accounts-addAccount',
		parentId: 'accounts',
		title: 'add account',
		contexts: ['link'],
	}, () => {
		const username = prompt('username'); // eslint-disable-line no-alert
		if (username === null) return;

		const password = prompt('password'); // eslint-disable-line no-alert
		if (password === null) return;

		accounts.push({ username, password });
		set(ACCOUNTS_KEY, accounts);
		init();
	});

	// separator
	if (accounts.length) {
		create({
			id: 'accounts-separator2',
			parentId: 'accounts',
			type: 'separator',
			contexts: ['link'],
		});
	}

	// "remove $account"
	for (const { username } of accounts) {
		create({
			id: `accounts-removeAccount_${username}`,
			parentId: 'accounts',
			title: `remove ${username}`,
			contexts: ['link'],
		}, () => {
			const index = accounts.findIndex(x => x.username === username);
			if (index === -1) throw new Error(`Cannot delete nonexistent account: ${username}`);

			accounts.splice(index, 1);
			set(ACCOUNTS_KEY, accounts);
			init();
		});
	}
})();

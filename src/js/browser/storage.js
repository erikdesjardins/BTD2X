/* @flow */

import { wrapSingleResult } from './_wrapper';

const _get = wrapSingleResult((keys, callback) => chrome.storage.sync.get(keys, callback));

export async function get(key, defaultVal = null) {
	return (await _get({ [key]: defaultVal }))[key];
}

const _set = wrapSingleResult((items, callback) => chrome.storage.sync.set(items, callback));

export async function set(key, val) {
	await _set({ [key]: val });
}

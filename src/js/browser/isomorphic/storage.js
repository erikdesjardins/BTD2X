/* @flow */

import { wrapSingleResult } from '../utils/wrapper';

const _get = wrapSingleResult((keys, callback) => chrome.storage.sync.get(keys, callback));

export async function get<T>(key: string, defaultVal: T): Promise<T> {
	return (await _get({ [key]: defaultVal }))[key];
}

const _set = wrapSingleResult((items, callback) => chrome.storage.sync.set(items, callback));

export async function set(key: string, val: mixed): Promise<void> {
	await _set({ [key]: val });
}

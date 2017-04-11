/* @flow */

import { wrapSingleResult } from '../utils/wrapper';

const _create = wrapSingleResult((options, callback) => chrome.contextMenus.create(options, callback));

const _remove = wrapSingleResult((id, callback) => chrome.contextMenus.remove(id, callback));

const _removeAll = wrapSingleResult(callback => chrome.contextMenus.removeAll(callback));

chrome.runtime.onMessage.addListener(([type, data], sender, sendResponse) => {
	if (type !== 'contextMenus') return;

	_remove(data.id).catch(() => {});
	_create(data);
	sendResponse();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	chrome.tabs.sendMessage(tab.id, ['contextMenus', info]);
});

chrome.runtime.onInstalled.addListener(() => {
	// remove all context menus on update, since ids may be removed or changed
	_removeAll();
});

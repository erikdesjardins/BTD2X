/* @flow */

type ItemType = 'normal' | 'checkbox' | 'radio' | 'separator';

type ContextType = 'all' | 'page' | 'frame' | 'selection' | 'link' | 'editable' | 'image' | 'video' | 'audio' | 'launcher' | 'browser_action' | 'page_action';

type MenuOptions = {|
	id: string,
	parentId?: string,
	type?: ItemType,
	contexts?: ContextType[],
	title?: string,
	targetUrlPatterns?: string[],
|};

const contextMenuListeners: Map<string, () => void | Promise<void>> = new Map();

export function create(options: MenuOptions, onclick?: () => void | Promise<void> = () => {}) {
	chrome.runtime.sendMessage(['contextMenus', options]);
	if (onclick) contextMenuListeners.set(options.id, onclick);
}

chrome.runtime.onMessage.addListener(([type, data], sender, sendResponse) => {
	if (type !== 'contextMenus') return;

	const listener = contextMenuListeners.get(data.menuItemId);
	if (!listener) throw new Error(`No listener for menu item: ${data.menuItemId}`);
	listener();

	sendResponse();
});

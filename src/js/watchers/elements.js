/* @flow */

import { MultiMap } from '../collections/multimap';
import { newAsyncIterable } from './utils/combinators';

const selectorMap: MultiMap<string, (HTMLElement) => void> = new MultiMap();

export function watchForElement(selector: string): AsyncIterable<HTMLElement> {
	return newAsyncIterable(push => {
		selectorMap.set(selector, push);
		return () => selectorMap.delete(selector, push);
	});
}

// after pageload, injected elements need to be queried
// since the callback will not be called for each child
let loaded = false;
window.addEventListener('DOMContentLoaded', () => { loaded = true; });

new MutationObserver(mutationRecords => {
	for (const record of mutationRecords) {
		for (const node of record.addedNodes) {
			if (node.nodeType !== Node.ELEMENT_NODE /*:: || !(node instanceof HTMLElement) */) continue;

			for (const [selector, pushers] of selectorMap.entries()) {
				if (node.matches(selector)) {
					for (const push of pushers) {
						push(node);
					}
				}

				if (loaded) {
					for (const child of node.querySelectorAll(selector)) {
						for (const push of pushers) {
							push(child);
						}
					}
				}
			}
		}
	}
}).observe(document, { childList: true, subtree: true });

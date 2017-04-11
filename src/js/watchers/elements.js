/* @flow */

import { MultiMap } from '../collections/multimap';
import { DefaultStream } from './utils/streams';

const selectorMap: MultiMap<string, DefaultStream<HTMLElement>> = new MultiMap();

export function watchForElement(selector: string): DefaultStream<HTMLElement> {
	const stream = new DefaultStream(() => { selectorMap.delete(selector, stream); });
	selectorMap.set(selector, stream);
	return stream;
}

// after pageload, injected elements need to be queried
// since the callback will not be called for each child
let loaded = false;
window.addEventListener('DOMContentLoaded', () => { loaded = true; });

new MutationObserver(mutationRecords => {
	for (const record of mutationRecords) {
		for (const node of record.addedNodes) {
			if (node.nodeType !== Node.ELEMENT_NODE /*:: || !(node instanceof Element) */) continue;

			for (const [selector, streams] of selectorMap.entries()) {
				if (node.matches(selector)) {
					for (const stream of streams) {
						stream._accept((node: any));
					}
				}

				if (loaded) {
					for (const child of node.querySelectorAll(selector)) {
						for (const stream of streams) {
							stream._accept(child);
						}
					}
				}
			}
		}
	}
}).observe(document, { childList: true, subtree: true });

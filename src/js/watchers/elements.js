/* @flow */

import { MultiMap } from '../collections/multimap';
import { DefaultStream } from './utils/streams';

const selectorMap: MultiMap<string, DefaultStream<HTMLElement>> = new MultiMap();

export function watchForElement(selector: string): DefaultStream<HTMLElement> {
	const stream = new DefaultStream(() => selectorMap.delete(selector, stream));
	selectorMap.set(selector, stream);
	return stream;
}

const seenNodes: WeakSet<Node> = new WeakSet();

new MutationObserver(mutationRecords => {
	for (const record of mutationRecords) {
		for (const node of record.addedNodes) {
			if (node.nodeType !== Node.ELEMENT_NODE) continue;

			if (seenNodes.has(node)) continue;
			seenNodes.add(node);

			for (const [selector, streams] of selectorMap.entries()) {
				if (!node.matches(selector)) continue;

				for (const stream of streams) {
					stream._accept((node: any));
				}
			}
		}
	}
}).observe(document, { childList: true, subtree: true });

/* @flow */

type PushItem<T> = (T) => void;
type OnClose = () => mixed;

export function newAsyncIterable<T>(executor: (PushItem<T>) => OnClose): AsyncIterable<T> {
	let queue = [];
	let waiting = null;

	const onClose = executor(x => {
		if (waiting === null) {
			queue.push(x);
		} else {
			waiting(x);
			waiting = null;
		}
	});

	const iterable = (async function* inner() {
		while (true) {
			if (queue.length === 0) {
				yield await new Promise(resolve => { // eslint-disable-line no-await-in-loop, no-loop-func
					waiting = resolve;
				});
			} else {
				const xs = queue;
				queue = [];
				for (const x of xs) {
					yield x;
				}
			}
		}
	})();
	// don't worry about it, flow
	/*:: ` */
	iterable.return = () => {
		onClose();
		return Promise.resolve({ value: undefined, done: true }); // eslint-disable-line no-undefined
	};
	iterable.throw = e => {
		onClose();
		return Promise.reject(e);
	};
	/*:: ` */

	return iterable;
}

export async function* filter<T>(asyncIterable: AsyncIterable<T>, predicate: (T) => boolean): AsyncIterable<T> {
	for await (const x of asyncIterable) {
		if (predicate(x)) yield x;
	}
}

export async function* map<T, R>(asyncIterable: AsyncIterable<T>, callback: (T) => R): AsyncIterable<R> {
	for await (const x of asyncIterable) {
		yield callback(x);
	}
}

export async function* take<T>(asyncIterable: AsyncIterable<T>, n: number): AsyncIterable<T> {
	let i = 0;
	for await (const x of asyncIterable) {
		if (++i > n) break;
		yield x;
	}
}

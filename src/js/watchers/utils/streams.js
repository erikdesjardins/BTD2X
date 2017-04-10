/* @flow */

class Stream<InputT, T> {
	_detach: () => void;
	_children: Array<Stream<T, any>>;
	_listeners: Array<(x: T) => void>;

	constructor(detach: () => void) {
		this._detach = detach;
		this._children = [];
		this._listeners = [];
	}

	__accept(x: T) {
		for (const callback of this._listeners) {
			callback(x);
		}
		for (const child of this._children) {
			child._accept(x);
		}
	}

	_maybeDetach() {
		if (
			this._listeners.length === 0 &&
			this._children.length === 0
		) {
			this._detach();
		}
	}

	_detachChild(child: Stream<T, any>) {
		const index = this._children.indexOf(child);
		if (index === -1) throw new Error('child is not attached');
		this._children.splice(index, 1);
		this._maybeDetach();
	}

	_accept(x: InputT) {
		throw new Error('_accept() must be implemented', x);
	}

	filter(predicate: (x: T) => boolean): FilterStream<T> {
		const stream = new FilterStream(() => this._detachChild(stream), predicate);
		this._children.push(stream);
		return stream;
	}

	map<V>(callback: (x: T) => V): MapStream<T, V> {
		const stream = new MapStream(() => this._detachChild(stream), callback);
		this._children.push(stream);
		return stream;
	}

	once(): OnceStream<T> {
		const stream = new OnceStream(() => this._detachChild(stream));
		this._children.push(stream);
		return stream;
	}

	forEach(callback: (x: T) => void): void {
		this._listeners.push(callback);
	}
}

export class DefaultStream<T> extends Stream<T, T> {
	_accept(x: T) {
		this.__accept(x);
	}
}

class FilterStream<T> extends Stream<T, T> {
	_predicate: (x: T) => boolean;

	constructor(detach: () => void, predicate: (x: T) => boolean) {
		super(detach);
		this._predicate = predicate;
	}

	_accept(x: T) {
		if (this._predicate(x)) {
			this.__accept(x);
		}
	}
}

class MapStream<T, V> extends Stream<T, V> {
	_callback: (x: T) => V;

	constructor(detach: () => void, callback: (x: T) => V) {
		super(detach);
		this._callback = callback;
	}

	_accept(x: T) {
		this.__accept(this._callback(x));
	}
}

class OnceStream<T> extends Stream<T, T> {
	_accept(x: T) {
		this.__accept(x);
		this._detach();
	}
}

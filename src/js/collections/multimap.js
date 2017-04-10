/* @flow */

export class MultiMap<K, V> {
	_map: Map<K, V[]>;

	constructor() {
		this._map = new Map();
	}

	clear() {
		this._map.clear();
	}

	delete(key: K, value: V): boolean {
		const values = this._map.get(key);
		if (!values) return false;
		const index = values.indexOf(value);
		if (index === -1) return false;
		values.splice(index, 1);
		if (values.length === 0) this._map.delete(key);
		return true;
	}

	deleteAll(key: K): boolean {
		return this._map.delete(key);
	}

	getAll(key: K): V[] {
		return this._map.get(key) || [];
	}

	has(key: K): boolean {
		return this._map.has(key);
	}

	set(key: K, value: V) {
		const existing = this._map.get(key);
		if (existing) {
			existing.push(value);
		} else {
			this._map.set(key, [value]);
		}
	}

	entries(): Iterable<[K, Array<V>]> {
		return this._map.entries();
	}
}

/* @flow */

export function wrapSingleResult(fn: (...args: mixed[]) => void): (...args: mixed[]) => Promise<any> {
	return (...args) =>
		new Promise((resolve, reject) =>
			fn(...args, result => {
				if (chrome.runtime.lastError) {
					reject(new Error(chrome.runtime.lastError.message));
				} else {
					resolve(result);
				}
			})
		);
}

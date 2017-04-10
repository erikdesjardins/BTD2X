/* @flow */

export function $<T: HTMLElement | string>(tagName: string, props: { [key: string]: mixed }, ...children: T[]): HTMLElement {
	const element = document.createElement(tagName);
	Object.assign(element, props);
	element.append(...children);
	return element;
}

/* @flow */

import { $ } from '../dom/element';
import { watchForElement } from '../watchers/elements';

const xpost = /(?:x|cross)[\s-]?post\S*.+/i;
const subreddit = /r\/(\w{2,20}\b)/i;
const xpostFrom = /^(?:\s+\S+)?\s+\/?(\w{2,20}\b)(?:[)\]}]|\S*$)/i;

watchForElement('.thing.link').forEach(thing => {
	const titleElement = thing.querySelector('a.title');
	if (!titleElement) return;

	const title = titleElement.textContent;
	if (!xpost.test(title)) return;

	const match = subreddit.exec(title) || xpostFrom.exec(title);
	if (!match) return;

	const userattrsElement = thing.querySelector('.userattrs');
	if (userattrsElement) {
		userattrsElement.after(
			'x-posted from ',
			$('a', { href: `/r/${match[1]}`, textContent: `/r/${match[1]}`, className: 'subreddit hover may-blank' })
		);
	}
});

import { Machine } from '../../../../../Machine/Machine.js';

import { Item } from '../../../../../Item/Item.js';
import { del } from '../../../../../Util/del.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Sink extends Machine {
	/** @type {{[key:string]:RegExp|'number'|'string'|'item'|'machine'}} */
	editableProps = {
		rotation: /^(0|90|180|270)$/,
	};
	location = currentFolder;
	prettyName = 'Developer Sink';
	description = 'A simple sink that logs when things are inputted';

	async loop() {}

	/**
	 * Adds an item to this machine
	 * @param {Item} item
	 */
	pushItem(item) {
		// if (game.platform == 'web') console.log(this.name + ':', item);
		// else
		// 	console.log(this.name + ':', item.name, '[', item.tags.join(', '), ']');

		del(item);
		return true;
	}
}

// @ts-ignore
game.machines['Sink'] = Sink;

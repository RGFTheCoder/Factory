import { deviate } from '../../../../../Util/random.js';
import { Item } from '../../../../../Item/Item.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Iron extends Item {
	location = currentFolder;

	name = 'Iron';
	data = { quality: deviate(0.8, 0.4) };
	tags = ['material.iron', 'mineral.iron', 'machine.atomizer'];

	/**
	 * convert an item into JSON representation. Must have type set to the registered name.
	 */
	serialize() {
		return {
			type: this.name,
			data: this.data,
		};
	}

	/**
	 * convert an item into JSON representation.
	 */
	static deserialize(data) {
		const out = new this();
		out.data = data.data;
		return out;
	}
}

game.items['Iron'] = Iron;

import { Item } from '../../../../Item/Item.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Electricity extends Item {
	location = currentFolder;

	data = {};
	tags = ['electricity'];

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

game.items['Electricity'] = Electricity;

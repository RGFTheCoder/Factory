import { fixTags } from '../Util/tags.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Item {
	get name() {
		const splitLoc = this.location.split('/');
		return splitLoc[splitLoc.length - 2];
	}
	// name = 'Item';
	/**
	 * @type {string}
	 */
	prettyName;
	data = {};
	tags = fixTags(['dev.items.defaultItem']);
	location = currentFolder;

	constructor() {
		this.tags = fixTags(this.tags);
		this.prettyName = this.prettyName ?? this.name;
	}

	toString() {
		return this.name;
	}

	/**
	 * convert an item into JSON representation. Must have type set to the registered name.
	 */
	serialize() {
		return {
			type: this.name,
		};
	}

	/**
	 * convert an item into JSON representation.
	 */
	static deserialize(data) {
		const out = new this();

		return out;
	}
}
game.items['Item'] = Item;

import { Machine } from '../../../../Machine/Machine.js';

import { Item } from '../../../../Item/Item.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

game.globalData.Storage = game.globalData.Storage ?? {
	Machines: [],
};

export class Storage extends Machine {
	/** @type {{[key:string]:RegExp|'number'|'string'|'item'|'machine'}} */
	editableProps = {
		// capacity: 'number',
		// inventory: 'string',
	};
	prettyName = 'Storage';
	location = currentFolder;
	description = 'A machine that can store items';
	// get description() {
	// 	return 'A machine storing: ' + this.inventory.join(', ');
	// }

	constructor(factory, x, y) {
		super(factory, x, y);
		game.globalData.Storage.Machines.push(this);
	}

	delete() {
		super.delete();
		game.globalData.Storage.Machines.splice(
			game.globalData.Storage.Machines.indexOf(this),
			1
		);
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {{[key:string]:HTMLImageElement}} sprites
	 */
	draw3(ctx, sprites) {
		try {
			ctx.drawImage(sprites[this.location + this.name + '.svg'], 0, 0, 1, 1);
		} catch (e) {}
	}

	/** @type {Item[]} */
	inventory = [];
	capacity = 10;

	async loop() {}

	/**
	 * convert an item into JSON representation. Must have type set to the registered name.
	 */
	serialize() {
		return {
			type: this.name,
			capacity: this.capacity,
			inventory: this.inventory.map((x) => x.serialize()),
		};
	}

	/**
	 * convert an item into JSON representation.
	 */
	static deserialize(data) {
		const out = new this();
		out.capacity = data.capacity;
		out.inventory = data.inventory.map((x) => game.funcs.deserializeItem(x));
		return out;
	}
}

// @ts-ignore
game.machines['Storage'] = Storage;

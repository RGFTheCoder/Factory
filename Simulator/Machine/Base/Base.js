import { Factory } from '../../Factory/Factory.js';
import { Item } from '../../Item/Item.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Base {
	/** @type {string[]} */
	tags = ['system'];
	/** @type {{[key:string]:RegExp|'number'|'string'|'item'|'machine'}} */
	editableProps = {
		rotation: /^(0|90|180|270)$/,
	};

	layers = 3;

	location = currentFolder;
	// name = 'Machine';
	get name() {
		const splitLoc = this.location.split('/');
		return splitLoc[splitLoc.length - 2];
	}
	/**
	 * @type {string}
	 */
	prettyName;
	description = 'A base machine';

	/**
	 * @type {NodeJS.Timeout}
	 */
	__loop;

	/**
	 * @type {0|1|2|3}
	 */
	rotations = 0;
	get rotation() {
		return ['0', '90', '180', '270'][this.rotations];
	}

	set rotation(value) {
		if (value + '' == '0') {
			this.rotations = 0;
		} else if (value + '' == '90') {
			this.rotations = 1;
		} else if (value + '' == '180') {
			this.rotations = 2;
		} else if (value + '' == '270') {
			this.rotations = 3;
		}
	}

	xpos = 0;
	ypos = 0;

	/**
	 *
	 * @param {Factory} factory the factory which this machine resides in
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(factory, x, y) {
		this.add(factory, x, y);
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {{[key:string]:HTMLImageElement}} sprites
	 */
	draw(ctx, sprites) {
		try {
		} catch (e) {}
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {{[key:string]:HTMLImageElement}} sprites
	 */
	draw2(ctx, sprites) {
		try {
		} catch (e) {}
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {{[key:string]:HTMLImageElement}} sprites
	 */
	draw3(ctx, sprites) {
		try {
		} catch (e) {}
	}

	/**
	 *
	 * @param {Factory} factory the factory which this machine resides in
	 * @param {*} x
	 * @param {*} y
	 */
	add(factory, x, y) {
		if (factory != null && this.factory == null) {
			this.xpos = x;
			this.ypos = y;
			this.factory = factory;
			this.factory.addPart(this, x, y);
			return true;
		}
		return false;
	}

	/**
	 * Clean up object
	 */
	delete() {
		if (this.factory != null) this.factory.removePart(this.xpos, this.ypos);
	}

	/**
	 * Function that is called many times per second
	 */
	async loop() {}

	/**
	 * Adds an item to this machine
	 * @param {Item} item
	 */
	pushItem(item) {
		return false;
	}

	/**
	 * Pulls a single item from this machine that matches the tags
	 * @param  {...string} tags
	 * @returns {Item|null}
	 */
	pullItem(...tags) {
		return null;
	}

	/**
	 * Pulls a specified amount of items that match the tags. If there are no enough, it pulls as many as it can. ie (output.length <= count)
	 * @param  {number} count
	 * @param  {...string} tags
	 * @returns  {Item[]}
	 */
	pullItems(count, ...tags) {
		const out = [];
		let it = new Item();
		for (let i = 0; i < count && it != null; i++) {
			it = this.pullItem(...tags);
			if (it != null) out.push(it);
		}

		return out;
	}

	/**
	 * convert an item into JSON representation. Must have type set to the registered name.
	 * @returns {Object}
	 */
	serialize() {
		return {
			type: this.name,
			x: this.xpos,
			y: this.ypos,
			rotation: this.rotations,
		};
	}

	/**
	 * convert an item into JSON representation.
	 */
	static deserialize(data, factory) {
		const out = new this(factory, data.x, data.y);
		out.rotations = data.rotation;
		return out;
	}

	toString() {
		return this.name;
	}
}
game.machines['Base'] = Base;

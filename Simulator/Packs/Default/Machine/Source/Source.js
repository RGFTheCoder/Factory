import { Machine } from '../../../../Machine/Machine.js';

import { Item } from '../../../../Item/Item.js';
import { compareTags, fixTags } from '../../../../Util/tags.js';
import { del } from '../../../../Util/del.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Source extends Machine {
	tags = fixTags(['natural.source', 'capability.mine']);
	/** @type {{[key:string]:RegExp|'number'|'string'|'item'|'machine'}} */
	editableProps = {
		itemType: 'item',
	};
	prettyName = 'Resource Node';
	description = 'A natural concentration of materials';
	location = currentFolder;
	/**
	 * @type {import('../../../../Util/types.js').Class<Item>}
	 */
	itemType = Item;

	// amount = 100
	amount = Infinity;

	async loop() {}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {{[key:string]:HTMLImageElement}} sprites
	 */
	draw(ctx, sprites) {
		const tempItem = new this.itemType();
		try {
			// ctx.drawImage(
			// 	sprites[this.location + this.name + '.svg'],
			// 	this.xpos,
			// 	this.ypos,
			// 	1,
			// 	1
			// );
			ctx.drawImage(
				sprites[tempItem.location + tempItem.name + '.svg'],
				0,
				0,
				1,
				1
			);
		} catch (e) {}
		del(tempItem);
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {{[key:string]:HTMLImageElement}} sprites
	 */
	draw2(ctx, sprites) {
		//draw any items (or middle layer) here
		try {
		} catch (e) {}
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {{[key:string]:HTMLImageElement}} sprites
	 */
	draw3(ctx, sprites) {
		// upper layer (above items)
		try {
		} catch (e) {}
	}

	/**
	 * Pulls a single item from this machine that matches the tags
	 * @param  {...string} tags
	 * @returns {Item|null}
	 */
	pullItem(...tags) {
		const possibleItem = new this.itemType();
		if (compareTags(possibleItem.tags, tags)) {
			this.amount--;
			if (this.amount == 0) this.factory.removePart(this.xpos, this.ypos);
			return possibleItem;
		} else {
			del(possibleItem);
			return null;
		}
	}
}

// @ts-ignore
game.machines['Source'] = Source;

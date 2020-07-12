import { Machine } from '../../Machine.js';
import { Item } from '../../../Item/Item.js';
import { compareTags } from '../../../Util/tags.js';
import { del } from '../../../Util/del.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class CreativeSource extends Machine {
	/** @type {{[key:string]:RegExp|'number'|'string'|'item'|'machine'}} */
	editableProps = {
		itemType: 'item',
	};
	prettyName = 'Creative Source';

	location = currentFolder;
	/**
	 * @type {import('../../../Util/types.js').Class<Item>}
	 */
	itemType = Item;

	loop() {}

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
			return possibleItem;
		} else {
			del(possibleItem);
			return null;
		}
	}
}

// @ts-ignore
game.machines['CreativeSource'] = CreativeSource;

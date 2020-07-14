import { Item } from '../../../../Item/Item.js';
import { Base } from '../../../../Machine/Base/Base.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Template extends Base {
	prettyName = 'Template';
	/** @type {{[key:string]:RegExp|'number'|'string'|'item'|'machine'}} */
	editableProps = {
		rotation: /^(0|90|180|270)$/,
		/* 
		You can also do:
		number
		string
		[RegEx(string)]
		item
		machine
		*/
	};

	location = currentFolder;
	description = 'A Template machine';

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {{[key:string]:HTMLImageElement}} sprites
	 */
	draw(ctx, sprites) {
		//bottom layer of machine
		super.draw(ctx, sprites);
		// try {
		// 	ctx.drawImage(
		// 		sprites[this.location + this.name + '.svg'],
		// 		0,
		// 		0,
		// 		1,
		// 		1
		// 	);
		// } catch (e) {}
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
		return [];
	}
}

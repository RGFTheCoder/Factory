import { Machine } from '../../../../../Machine/Machine.js';

import { Factory } from '../../../../../Factory/Factory.js';
import { Item } from '../../../../../Item/Item.js';
import { compareTags, fixTags } from '../../../../../Util/tags.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

game.globalData.Storage = game.globalData.Storage ?? {
	Machines: [],
};

export class OmniMover extends Machine {
	prettyName = 'OmniMover';
	/** @type {{[key:string]:import('../../../../../Util/types.js').ViewableTypes}} */
	editableProps = {};

	tags = fixTags(['machine.omnimover', 'capability.extract']);

	location = currentFolder;
	description =
		'A machine that allows you to input and output anything from your storage system.';

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {{[key:string]:HTMLImageElement}} sprites
	 */
	draw3(ctx, sprites) {
		try {
			ctx.drawImage(sprites[this.location + this.name + '.svg'], 0, 0, 1, 1);
			ctx.drawImage(
				sprites[location.origin + '/Simulator/Machine/MiscAssets/Cover.svg'],
				0,
				-0.5,
				1,
				1
			);
			ctx.translate(0.5, 0.5);
			ctx.rotate(Math.PI / 2);
			ctx.translate(-0.5, -0.5);
			ctx.drawImage(
				sprites[location.origin + '/Simulator/Machine/MiscAssets/Cover.svg'],
				0,
				-0.5,
				1,
				1
			);
			ctx.translate(0.5, 0.5);
			ctx.rotate(Math.PI / 2);
			ctx.translate(-0.5, -0.5);
			ctx.drawImage(
				sprites[location.origin + '/Simulator/Machine/MiscAssets/Cover.svg'],
				0,
				-0.5,
				1,
				1
			);
			ctx.translate(0.5, 0.5);
			ctx.rotate(Math.PI / 2);
			ctx.translate(-0.5, -0.5);
			ctx.drawImage(
				sprites[location.origin + '/Simulator/Machine/MiscAssets/Cover.svg'],
				0,
				-0.5,
				1,
				1
			);
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
		/**
		 * @type {{
		 * 	Machines:import('../Storage.js').Storage[];
		 * }}
		 * */
		const store = game.globalData.Storage;
		for (let mach of store.Machines) {
			if (mach.inventory.length < mach.capacity) {
				mach.inventory.push(item);
				return true;
			}
		}
		return false;
	}

	/**
	 * Pulls a single item from this machine that matches the tags
	 * @param  {...string} tags
	 * @returns {Item|null}
	 */
	pullItem(...tags) {
		/**
		 * @type {{
		 * 	Machines:import('../Storage.js').Storage[];
		 * }}
		 * */
		const store = game.globalData.Storage;
		for (let mach of store.Machines) {
			const avail = mach.inventory.filter((x) => compareTags(x.tags, tags));
			if (avail.length > 0) {
				const out = avail.pop();
				mach.inventory.splice(mach.inventory.indexOf(out), 1);
				return out;
			}
		}
		return null;
	}
}

// @ts-ignore
game.machines['OmniMover'] = OmniMover;

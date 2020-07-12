import { Machine } from '../Machine.js';
import { Factory } from '../../Factory/Factory.js';
import { Item } from '../../Item/Item.js';
import { compareTags } from '../../Util/tags.js';
import { deviate } from '../../Util/random.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Conveyor extends Machine {
	prettyName = 'Conveyor';
	/** @type {{[key:string]:RegExp|'number'|'string'|'item'|'machine'}} */
	editableProps = {
		rotation: /^(0|90|180|270)$/,
		maxConcurrent: 'number',
		transferRate: 'number',
		bend: /^[SRL]$/,
	};

	location = currentFolder;
	description = 'A conveyor that carries items';
	drawLayer = 0;

	/**
	 * @type {Item[]}
	 */
	store = [];
	maxConcurrent = 16;
	transferRate = 1;

	/**
	 * @type {'L'|'S'|'R'}
	 */
	bend = 'S';

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {{[key:string]:HTMLImageElement}} sprites
	 */
	draw(ctx, sprites) {
		// super.draw(ctx, sprites);
		try {
			ctx.drawImage(
				sprites[this.location + this.name + this.bend + '.svg'],
				0,
				0,
				1,
				1
			);
		} catch (e) {}
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {{[key:string]:HTMLImageElement}} sprites
	 */
	draw2(ctx, sprites) {
		// super.draw(ctx, sprites);
		try {
			const currentProgress =
				this.store.length == this.maxConcurrent
					? 0.25
					: 0.75 - (Date.now() - this.lastLoop) / game.tickSpeed;
			// const currentProgress =
			// 	0.75 - (Date.now() - this.lastLoop) / game.tickSpeed;
			for (let item of this.store) {
				ctx.drawImage(
					sprites[item.location + item.name + '.svg'],
					deviate(0.25, 0.0),
					currentProgress,
					1 / 2,
					1 / 2
				);
			}
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

	lastLoop = Date.now();

	/**
	 * Function that is called many times per second
	 */
	loop() {
		this.lastLoop = Date.now();

		const output =
			this.bend == 'S'
				? this.factory.getRelative(this, 0, -1)
				: this.bend == 'R'
				? this.factory.getRelative(this, 1, 0)
				: this.bend == 'L'
				? this.factory.getRelative(this, -1, 0)
				: null;

		if (output != null) {
			let success = true;

			for (
				let i = 0;
				i < this.transferRate && success && this.store.length > 0;
				++i
			) {
				const curr = this.store.pop();
				success = output.pushItem(curr);
				if (!success) {
					this.store.push(curr);
				}
			}
		}
		const input = this.factory.getRelative(this, 0, 1);
		if (input != null) {
			const passed = input.pullItems(this.maxConcurrent - this.store.length);
			this.store.push(...passed);
		}
	}

	/**
	 * Adds an item to this machine
	 * @param {Item} item
	 */
	pushItem(item) {
		if (this.store.length < this.maxConcurrent) {
			this.store.push(item);
		} else return false;
	}

	/**
	 * Pulls a single item from this machine that matches the tags
	 * @param  {...string} tags
	 * @returns {Item|null}
	 */
	pullItem(...tags) {
		const accepted = this.store.filter((x) => compareTags(x.tags, tags));
		if (accepted.length == 0) return null;
		const choice = accepted[0];
		this.store.splice(this.store.indexOf(choice), 1);
		return choice;
	}

	/**
	 * Pulls a specified amount of items that match the tags. If there are not enough, it pulls as many as it can. ie (output.length <= count)
	 * @param  {number} count
	 * @param  {...string} tags
	 * @returns  {Item[]}
	 */
	pullItems(count, ...tags) {
		const out = [];
		const accepted = this.store.filter((x) => compareTags(x.tags, tags));
		for (let i = 0; accepted.length > 0 && i < count; i++) {
			out.push(accepted.pop());
		}
		for (let item of out) {
			this.store.splice(this.store.indexOf(item), 1);
		}
		return out;
	}
}

// @ts-ignore
game.machines['Conveyor'] = Conveyor;

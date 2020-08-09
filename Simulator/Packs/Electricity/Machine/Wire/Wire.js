import { Machine } from '../../../../Machine/Machine.js';

import { Factory } from '../../../../Factory/Factory.js';
import { Item } from '../../../../Item/Item.js';
import { compareTags, fixTags, hasTag } from '../../../../Util/tags.js';
import { deviate } from '../../../../Util/random.js';
import { deserializeItem } from '../../../../Util/serialize.js';
import { V2 } from '../../../../Util/Vec2.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Wire extends Machine {
	tags = fixTags(['machine.wire', 'capability.extract']);
	prettyName = 'Wire';
	/** @type {{[key:string]:import('../../../../Util/types.js').ViewableTypes}} */
	editableProps = {
		rotation: /^(0|90|180|270)$/,
		// maxConcurrent: 'number',
		// transferRate: 'number',
		// bend: /^[SRL]$/,
	};

	location = currentFolder;
	description = 'A wire that carries electricity';
	/**
	 * @type {Item[]}
	 */
	get store() {
		return [...this.inStore, ...this.outStore];
	}
	/**
	 * @type {Item[]}
	 */
	inStore = [];
	/**
	 * @type {Item[]}
	 */
	outStore = [];
	maxConcurrent = 1;
	transferRate = 1;

	constructor(factory, x, y) {
		super(factory, x, y);
	}

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
			ctx.translate(0.5, 0.5);
			ctx.rotate(
				this.bend == 'R' ? -Math.PI / 2 : this.bend == 'L' ? Math.PI / 2 : 0
			);
			ctx.translate(-0.5, -0.5);
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
	wdraw2(ctx, sprites) {
		if (this.store.length) {
			const stepSize = 1 / this.maxConcurrent;
			for (let i = 0; i < this.store.length; i++) {
				const pos = V2.make(0, 0);
				// if (Math.random() < 0.002) console.log(pos);
				V2.add(pos, [this.xpos, this.ypos], pos);
				V2.copy(pos, this.store[i].optMovablePos.target);
			}

			for (let i = 0; i < this.store.length; i++) {
				const out = V2.sub(
					this.store[i].optMovablePos.target,
					this.store[i].optMovablePos.current
				);
				out.radius *= 1 / 30;

				V2.add(
					this.store[i].optMovablePos.current,
					out,
					this.store[i].optMovablePos.current
				);
			}
		}

		// super.draw(ctx, sprites);
		try {
			// const currentProgress = 0.25;
			// const currentProgress =
			// 	0.75 - (Date.now() - this.lastLoop) / game.tickSpeed;
			for (let item of this.store) {
				const drawnPos = V2.copy(item.optMovablePos.current);
				// V2.sub(drawnPos, [this.xpos, this.ypos], drawnPos);
				// V2.sub(drawnPos, [-0.5, -0.5], drawnPos);
				// drawnPos.theta = drawnPos.theta - 90 * this.rotations;
				// V2.add(drawnPos, [0.25, 0.25], drawnPos);

				// if (this.rotations == 0) {
				// 	V2.sub(drawnPos, [1, 1], drawnPos);
				// }

				ctx.drawImage(
					sprites[item.location + item.name + '.svg'],
					drawnPos.x,
					drawnPos.y,
					1,
					1
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

	uLayers = 1;

	/**
	 * Function that is called many times per second
	 */
	async loop() {
		if (this.factory != null) {
			if (
				this.factory.getRelative(this, 0, 1) &&
				this.factory.getRelative(this, 0, 1).rotations == this.rotations
			)
				this.bend = 'S';
			else if (
				this.factory.getRelative(this, -1, 0) &&
				this.factory.getRelative(this, -1, 0).rotations ==
					(this.rotations + 1) % 4
			)
				this.bend = 'L';
			else if (
				this.factory.getRelative(this, 1, 0) &&
				this.factory.getRelative(this, 1, 0).rotations ==
					(this.rotations + 3) % 4
			)
				this.bend = 'R';
		}

		this.lastLoop = Date.now();

		const output = this.factory.getRelative(this, 0, -1);

		if (output != null) {
			if (output.rotations == (this.rotations + 2) % 4) {
				output.rotations = this.rotations;
			}

			let success = true;

			for (
				let i = 0;
				i < this.transferRate && success && this.outStore.length > 0;
				++i
			) {
				const curr = this.outStore.pop();
				success = output.pushItem(curr);
				if (!success) {
					this.outStore.push(curr);
				}
			}
		}
		// const input = this.factory.getRelative(this, 0, 1);
		// if (input != null) {
		// 	const passed = input.pullItems(this.maxConcurrent - this.store.length);
		// 	this.store.push(...passed);
		// }
	}

	async loop1() {
		while (this.inStore.length && this.store.length <= this.maxConcurrent) {
			this.outStore.push(this.inStore.shift());
		}
	}

	/**
	 * Adds an item to this machine
	 * @param {Item} item
	 */
	pushItem(item) {
		if (this.store.length < this.maxConcurrent && hasTag(item, 'electricity')) {
			this.inStore.push(item);
			return true;
		} else return false;
	}

	/**
	 * Pulls a single item from this machine that matches the tags
	 * @param  {...string} tags
	 * @returns {Item|null}
	 */
	pullItem(...tags) {
		const accepted = this.outStore.filter((x) => compareTags(x.tags, tags));
		if (accepted.length == 0) return null;
		const choice = accepted[0];
		this.outStore.splice(this.outStore.indexOf(choice), 1);
		return choice;
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
			bend: this.bend,
			inStore: this.inStore.map((x) => x.serialize()),
			outStore: this.outStore.map((x) => x.serialize()),
			maxConcurrent: this.maxConcurrent,
			transferRate: this.transferRate,
		};
	}

	/**
	 * convert an item into JSON representation.
	 */
	static deserialize(data, factory) {
		const out = new this(factory, data.x, data.y);
		out.rotations = data.rotation;
		out.bend = data.bend;
		out.maxConcurrent = data.maxConcurrent;
		out.transferRate = data.transferRate;
		out.inStore = data.inStore.map((x) => deserializeItem(x));
		out.outStore = data.outStore.map((x) => deserializeItem(x));
		return out;
	}
}

// @ts-ignore
game.machines['Wire'] = Wire;

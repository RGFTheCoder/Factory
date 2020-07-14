import { Base } from '../Machine/Base/Base.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Machine extends Base {
	/** @type {string[]} */
	tags = ['system'];
	/** @type {{[key:string]:import('../Util/types.js').ViewableTypes}} */
	editableProps = {
		rotation: /^(0|90|180|270)$/,
	};

	location = currentFolder;

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {{[key:string]:HTMLImageElement}} sprites
	 */
	draw(ctx, sprites) {
		try {
			ctx.drawImage(
				sprites[location.origin + '/Simulator/MiscAssets/Machine.svg'],
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
			ctx.rotate(Math.PI);
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
}
game.machines['Machine'] = Machine;

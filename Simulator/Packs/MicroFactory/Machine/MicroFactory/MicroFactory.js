import { Base } from '../../../../Machine/Base/Base.js';
import { Factory } from '../../../../Factory/Factory.js';
import { fixTags, compareTags } from '../../../../Util/tags.js';
import { Item } from '../../../../Item/Item.js';
import { del } from '../../../../Util/del.js';
import { MicroFactoryInput } from './MicroFactoryInput/MicroFactoryInput.js';
import { MicroFactoryOutput } from './MicroFactoryOutput/MicroFactoryOutput.js';
/// <reference path="./Util/types.d.ts" />

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class MicroFactory extends Base {
	location = currentFolder;
	prettyName = 'Micro Factory';
	description = 'A compressed factory';

	tags = fixTags(['system', 'capability.extract']);
	/** @type {0} */
	get rotations() {
		return 0;
	}
	facto = new Factory();

	/** @type {{[key:string]: import('../../../../Util/types.js').ViewableTypes}} */
	editableProps = {
		width: game.DEV ? 'number' : 'none',
		height: game.DEV ? 'number' : 'none',
		editor(div) {
			/** @type {MicroFactory} */
			// @ts-ignore
			const t = this;
			if (game.platform == 'web') {
				const button = document.createElement('button');
				button.append(document.createTextNode('Open Editor'));
				button.addEventListener('click', () => {
					t.openShower();
				});

				div.appendChild(button);
			}
		},
	};

	constructor(factory, x, y) {
		super(factory, x, y);
		this.facto.constraints.push((machine, x, y) => x >= -this._width);
		this.facto.constraints.push((machine, x, y) => y >= -this._height);
		this.facto.constraints.push((machine, x, y) => x < this._width);
		this.facto.constraints.push((machine, x, y) => y < this._height);
		this.addTunnels();
	}
	/** @type {Item} */
	inStore = null;
	/** @type {Item} */
	outStore = null;

	_width = 5;
	_height = 5;
	get width() {
		return this._width * 2;
	}
	get height() {
		return this._height * 2;
	}
	set width(value) {
		this.removeTunnels();
		this._width = (value / 2) | 0;
		this.addTunnels();
	}
	set height(value) {
		this.removeTunnels();
		this._height = (value / 2) | 0;
		this.addTunnels();
	}

	addTunnels() {
		const inp = new MicroFactoryInput(this.facto, -this._width, -this._height);
		inp.parent = this;
		const oup = new MicroFactoryOutput(
			this.facto,
			this._width - 1,
			this._height - 1
		);
		oup.parent = this;
	}

	removeTunnels() {
		del(this.facto.at(-this._width, -this._height));
		del(this.facto.at(this._width - 1, this._height - 1));
	}

	openShower() {
		/**
		 * @type {globalThis}
		 */
		// @ts-ignore
		const interfac = open(
			'/WebInterface/?save=' +
				game.save +
				'&noLoad=true&noSave=true&noLoop=true'
		);

		interfac.addEventListener('load', () => {
			interfac.game.factory.world = this.facto.world;
			interfac.game.factory.constraints = this.facto.constraints;
		});
	}

	async loop() {
		this.facto.loop();
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {{[key:string]:HTMLImageElement}} sprites
	 */
	draw(ctx, sprites) {
		try {
			ctx.drawImage(sprites[this.location + this.name + '.svg'], 0, 0, 1, 1);
		} catch (e) {}
	}

	miniCanvas = document.createElement('canvas');
	miniCtx = this.miniCanvas.getContext('2d');

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {{[key:string]:HTMLImageElement}} sprites
	 */
	draw3(ctx, sprites) {
		try {
			const scale = 32;
			//MINICANVAS START
			this.miniCanvas.width = this.width * scale;
			this.miniCanvas.height = this.height * scale;
			this.miniCtx.translate(
				this.miniCanvas.width / 2,
				this.miniCanvas.height / 2
			);
			this.miniCtx.scale(scale, scale);
			let shownTiles = this.facto.world.itemList;

			for (const tile of shownTiles) {
				this.miniCtx.save();
				this.miniCtx.translate(tile.xpos + 0.5, tile.ypos + 0.5);
				this.miniCtx.rotate((Math.PI / 2) * tile.rotations);
				this.miniCtx.translate(-0.5, -0.5);
				tile?.draw?.(this.miniCtx, sprites);
				this.miniCtx.restore();
			}

			for (let layer = 1; shownTiles.length > 0; layer++) {
				shownTiles = shownTiles.filter((x) => x.layers >= layer);

				for (const tile of shownTiles) {
					this.miniCtx.save();
					this.miniCtx.translate(tile.xpos + 0.5, tile.ypos + 0.5);
					this.miniCtx.rotate((Math.PI / 2) * tile.rotations);
					this.miniCtx.translate(-0.5, -0.5);
					tile?.['draw' + layer]?.(this.miniCtx, sprites);
					this.miniCtx.restore();
				}
			}

			//MINICANVAS END
			ctx.drawImage(this.miniCanvas, 1 / 8, 1 / 8, 6 / 8, 6 / 8);
		} catch (E) {}
	}

	pushItem(item) {
		if (this.inStore == null) {
			this.inStore = item;
			return true;
		}
		return false;
	}

	pullItem(...tags) {
		if (this.outStore != null && compareTags(this.outStore.tags, tags)) {
			const out = this.outStore;
			this.outStore = null;
			return out;
		}
		return null;
	}

	/**
	 * convert an item into JSON representation. Must have type set to the registered name.
	 * @returns {Object}
	 */
	serialize() {
		this.removeTunnels();
		const out = {
			type: this.name,
			x: this.xpos,
			y: this.ypos,
			width: this.width,
			height: this.height,
			data: this.facto.serialize(),
		};
		this.addTunnels();
		return out;
	}

	/**
	 * convert an item into JSON representation.
	 */
	static deserialize(data, factory) {
		const out = new this(factory, data.x, data.y);
		out.facto.deserialize(data.data);
		out.width = data.width;
		out.height = data.height;
		return out;
	}
}

if (game.DEV) game.machines['MicroFactory'] = MicroFactory;

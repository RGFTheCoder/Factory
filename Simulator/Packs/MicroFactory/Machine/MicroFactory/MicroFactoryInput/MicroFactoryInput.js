import { Base } from '../../../../../Machine/Base/Base.js';
import { Factory } from '../../../../../Factory/Factory.js';
import { fixTags, compareTags } from '../../../../../Util/tags.js';
import { MicroFactory } from '../MicroFactory.js';
/// <reference path="./Util/types.d.ts" />

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class MicroFactoryInput extends Base {
	/** @type {MicroFactory} */
	parent;

	location = currentFolder;
	prettyName = 'Micro Factory Input';
	description = 'A compressed factory input';

	tags = fixTags(['system', 'capability.extract']);
	/** @type {0} */
	get rotations() {
		return 0;
	}
	/** @type {{ [key: string]: import('../../../../../Util/types.js').ViewableTypes; }} */
	editableProps = {};

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

	pullItem(...tags) {
		if (
			this.parent.inStore != null &&
			compareTags(this.parent.inStore.tags, tags)
		) {
			const out = this.parent.inStore;
			this.parent.inStore = null;
			return out;
		}
		return null;
	}

	/**
	 * convert an item into JSON representation. Must have type set to the registered name.
	 * @returns {Object}
	 */
	serialize() {
		return {
			type: 'Base',
			x: this.xpos,
			y: this.ypos,
		};
	}

	/**
	 * convert an item into JSON representation.
	 * @returns {never}
	 */
	static deserialize(data, factory) {
		throw new Error(`Don't deserialize ${this.name}`);
	}
}
if (game.urlParams.get('inMicroFactory'))
	// @ts-ignore
	game.machines['MicroFactoryInput'] = MicroFactoryInput;

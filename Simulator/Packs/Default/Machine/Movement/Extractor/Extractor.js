import { Item } from '../../../../../Item/Item.js';
import { fixTags, hasTag } from '../../../../../Util/tags.js';
import { Base } from '../../../../../Machine/Base/Base.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Extractor extends Base {
	tags = fixTags(['machine.extractor']);
	prettyName = 'Extractor';
	/** @type {{[key:string]:RegExp|'number'|'string'|'item'|'machine'}} */
	editableProps = {
		rotation: /^(0|90|180|270)$/,
		customFilter: 'string',
	};

	location = currentFolder;
	description = 'An extractor that removes items from a machine.';

	/**
	 * @type {Item}
	 */
	store = null;

	reqTag = 'capability.extract';
	customFilter = '';

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {{[key:string]:HTMLImageElement}} sprites
	 */
	draw3(ctx, sprites) {
		// upper layer (above items)
		try {
			ctx.drawImage(
				sprites[this.location + 'ExtractorBase' + '.svg'],
				0,
				0,
				1,
				1
			);
			ctx.drawImage(sprites[this.location + this.name + '.svg'], 0, 0, 1, 2);
		} catch (e) {}
	}

	/**
	 * Function that is called many times per second
	 */
	async loop() {
		const output = this.factory.getRelative(this, 0, -1);

		if (output != null && this.store != null) {
			if (output.pushItem(this.store)) {
				this.store = null;
			}
		}
		const input = this.factory.getRelative(this, 0, 1);
		if (input != null && this.store == null) {
			if (
				hasTag(input, this.reqTag) &&
				(this.customFilter == '' || hasTag(input, this.customFilter))
			) {
				const pulled = input.pullItem();
				if (pulled != null) this.store = pulled;
			}
		}
	}

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
}

// @ts-ignore
game.machines['Extractor'] = Extractor;

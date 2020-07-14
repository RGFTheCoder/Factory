import { fixTags } from '../../../../../../Util/tags.js';
import { Extractor } from '../Extractor.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Mine extends Extractor {
	tags = fixTags(['machine.mine']);
	prettyName = 'Mine';

	location = currentFolder;
	description = 'A mine that mines things from sources.';

	reqTag = 'capability.mine';
	/** @type {{[key:string]:import('../../../../../../Util/types.js').ViewableTypes}} */
	editableProps = {
		rotation: /^(0|90|180|270)$/,
	};

	draw3(ctx, sprites) {
		try {
			ctx.drawImage(
				sprites[this.location + '../ExtractorBase' + '.svg'],
				0,
				0,
				1,
				1
			);
		} catch (error) {}
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {{[key:string]:HTMLImageElement}} sprites
	 */
	draw4(ctx, sprites) {
		// upper layer (above items)
		try {
			ctx.drawImage(sprites[this.location + this.name + '.svg'], 0, 0, 1, 2);
		} catch (e) {}
	}
}

// @ts-ignore
game.machines['Mine'] = Mine;

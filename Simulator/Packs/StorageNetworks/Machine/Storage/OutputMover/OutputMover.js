import { OmniMover } from '../OmniMover/OmniMover.js';
import { fixTags } from '../../../../../Util/tags.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class OutputMover extends OmniMover {
	/** @type {{[key:string]:RegExp|'number'|'string'|'item'|'machine'}} */
	editableProps = {};
	prettyName = 'Output Mover';
	description =
		'A machine that allows you to output anything from your storage system.';

	tags = fixTags(['machine.outputmover', 'capability.extract']);

	location = currentFolder;

	pushItem(item) {
		return false;
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
}

// @ts-ignore
game.machines['OutputMover'] = OutputMover;

import { Item } from '../../Item/Item.js';
import { del } from '../../Util/del.js';
import { hasTag } from '../../Util/tags.js';
import { Machine } from '../Machine.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Atomizer extends Machine {
	prettyName = 'Atomizer';
	description = 'Breaks things down into base elements.';
	/** @type {{[key:string]:RegExp|'number'|'string'|'item'|'machine'}} */
	editableProps = {
		rotation: /^(0|90|180|270)$/,
	};

	location = currentFolder;
	/**
	 * @type {Item}
	 */
	store = null;

	outputStack = [];

	constructor(factory, x, y) {
		super(factory, x, y);
	}

	loop() {
		//expunge elements
		const output = this.factory.getRelative(this, 0, -1);
		if (output != null && this.outputStack.length > 0) {
			let success = true;

			while (success && this.outputStack.length > 0) {
				const curr = this.outputStack.pop();
				success = output.pushItem(curr);
				if (!success) {
					this.outputStack.push(curr);
				}
			}
			return;
		}
		//convert stored item into element
		const recipes = game.recipes.filter((x) => x.type == 'atomizer');

		if (this.store != null && hasTag(this.store, 'machine.atomizer')) {
			for (let rec in recipes) {
				const recipe = recipes[rec];
				if (hasTag(this.store, recipe.input)) {
					del(this.store);
					this.store = null;
					this.outputStack.push(...recipe.output.map((x) => new x()));
					return;
				}
			}
		}
		//input coal
		const input = this.factory.getRelative(this, 0, 1);
		if (input != null && this.store == null) {
			const pulled = input.pullItem('machine.atomizer');
			this.store = pulled;
		}
	}
}

game.machines['Atomizer'] = Atomizer;

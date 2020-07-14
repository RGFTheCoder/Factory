import { Item } from '../../Item/Item.js';
import { del } from '../../Util/del.js';
import { hasTag } from '../../Util/tags.js';
import { Machine } from '../Machine.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Crafter extends Machine {
	/** @type {string[]} */
	tags = ['system'];
	prettyName = 'Crafter';
	description = 'A base crafter.';
	/** @type {{[key:string]:RegExp|'number'|'string'|'item'|'machine'}} */
	editableProps = {
		rotation: /^(0|90|180|270)$/,
	};

	crafterType = 'baseCrafter';
	// crafterType = 'atomizer';

	location = currentFolder;
	/**
	 * @type {Item[]}
	 */
	store = [];

	/**
	 * @type {Item[]}
	 */
	outputStack = [];

	work = 0;

	constructor(factory, x, y) {
		super(factory, x, y);
	}

	async loop() {
		if (this.work > 0) {
			this.work--;
			return;
		}

		//expunge elements
		if (this.outputStack.length > 0) {
			const output = this.factory.getRelative(this, 0, -1);
			if (output != null) {
				let success = true;

				while (success && this.outputStack.length > 0) {
					const curr = this.outputStack.pop();
					success = output.pushItem(curr);
					if (!success) {
						this.outputStack.push(curr);
					}
				}
			}
			return;
		}
		//find allowed recipes
		let recipes = game.recipes
			.filter((x) => x.type == this.crafterType)
			.map((x) => ({ inp: [...x.input], reci: x }));

		for (let item of this.store) {
			recipes = recipes.filter((rec) => {
				for (let inp of rec.inp) {
					if (hasTag(item, inp)) {
						rec.inp.splice(rec.inp.indexOf(inp), 1);
						return true;
					}
				}
				return false;
			});
		}

		//craft
		const completeRecipes = recipes.filter((x) => x.inp.length == 0);

		if (completeRecipes.length > 0) {
			this.work = completeRecipes[0].reci.work;

			while (this.store.length > 0) this.store.pop();

			while (this.outputStack.length > 0) this.outputStack.pop();
			this.outputStack.push(
				...completeRecipes[0].reci.output.map((x) => new x())
			);
		}

		// if (this.store != null && hasTag(this.store, 'machine.atomizer')) {
		// 	for (let rec in recipes) {
		// 		const recipe = recipes[rec];
		// 		if (hasTag(this.store, recipe.input)) {
		// 			del(this.store);
		// 			this.store = null;
		// 			this.outputStack.push(...recipe.output.map((x) => new x()));
		// 			return;
		// 		}
		// 	}
		// }
	}

	/**
	 *
	 * @param {Item} item
	 */
	pushItem(item) {
		let recipes = game.recipes
			.filter((x) => x.type == this.crafterType)
			.map((x) => [...x.input]);

		for (let item of this.store) {
			recipes = recipes.filter((rec) => {
				for (let inp of rec) {
					if (hasTag(item, inp)) {
						rec.splice(rec.indexOf(inp), 1);
						return true;
					}
				}
				return false;
			});
		}

		/** @type {Set<string>} */
		const needs = new Set();
		for (let rec of recipes) {
			for (let ingredient of rec) {
				needs.add(ingredient);
			}
		}

		for (const tag of [...needs]) {
			if (hasTag(item, tag)) {
				this.store.push(item);
				return true;
			}
		}

		return false;
	}

	/**
	 * convert an item into JSON representation. Must have type set to the registered name.
	 */
	serialize() {
		return {
			type: this.name,
			x: this.xpos,
			y: this.ypos,
			rotation: this.rotations,
			crafterType: this.crafterType,
			work: this.work,
			store: this.store.map((x) => x.serialize()),
			outputStack: this.outputStack.map((x) => x.serialize()),
		};
	}

	/**
	 * convert an item into JSON representation.
	 */
	static deserialize(data, factory) {
		const out = new this(factory, data.x, data.y);
		out.rotations = data.rotation;
		out.crafterType = data.crafterType;
		out.work = data.work;
		out.store = data.store.map((x) => game.funcs.deserializeItem(x));
		out.outputStack = data.outputStack.map((x) =>
			game.funcs.deserializeItem(x)
		);

		return out;
	}
}
game.machines['Crafter'] = Crafter;

import { Base } from '../Machine/Base/Base.js';
import { MagicGrid } from '../Util/MagicGrid.js';
import { deserializeMachine } from '../Util/serialize.js';

export class Factory {
	/**
	 * @type {MagicGrid<Base>}
	 */
	world = new MagicGrid();
	_loop = 0;

	/**
	 * @type {((machine:Base, x:number, y:number)=>boolean)[]}
	 */
	constraints = [];

	constructor() {
		// this.gameLoop();
	}

	gameLoop() {
		this.loop();
		setTimeout(() => this.gameLoop(), game.tickSpeed);
	}

	/**
	 * Get a machine at specified coordinates
	 * @param {number} x
	 * @param {number} y
	 */
	at(x, y) {
		return this.world.get(x, y);
	}

	/**
	 * Get location of a machine
	 * @param {Base} machine
	 */
	find(machine) {
		return this.world.whereIs(machine);
	}
	/**
	 * Add a machine at specified coordinates
	 * @param {Base} machine
	 * @param {number} x
	 * @param {number} y
	 */
	addPart(machine, x, y) {
		for (const constraint of this.constraints) {
			if (!constraint(machine, x, y)) return;
		}
		this.world.set(x, y, machine);
	}
	/**
	 * Remove a machine at specified coordinates
	 * @param {number} x
	 * @param {number} y
	 */
	removePart(x, y) {
		this.world.remove(x, y);
		// machine.delete();
	}
	/**
	 * Runs the entire world loop on round-robin
	 */
	async loop() {
		for (const item of this.world.itemList) {
			item.loopTime++;
			if (item.loopTime == item.loopSpeed) {
				item.loopTime = 0;
			}
		}

		for (const item of this.world.itemList) {
			if (item.loopTime == 0) {
				item.loop();
			}
		}

		let items = [...this.world.itemList];

		for (let layer = 1; items.length > 0; layer++) {
			items = items.filter((x) => x.uLayers >= layer);

			for (const item of items) {
				if (item.loopTime == 0) {
					item?.['loop' + layer]?.();
				}
			}
		}

		if (this.world.itemList.length > 1)
			this.world.itemList.push(this.world.itemList.shift());
	}
	/**
	 * Gets a machine relative to another
	 * @param {Base} machine
	 * @param {number} x
	 * @param {number} y
	 */
	getRelative(machine, x, y) {
		const position = this.find(machine);
		if (position == null) return null;

		let req = [x, y];
		for (let i = 0; i < machine.rotations; ++i) {
			// (x,y) -> (y,-x)
			req = [-req[1], req[0]];
		}

		return this.at(position[0] + req[0], position[1] + req[1]);
	}

	serialize() {
		return this.world.itemList
			.map((x) => x.serialize())
			.filter((x) => typeof x != 'undefined');
	}

	deserialize(world) {
		for (let thing of world) {
			deserializeMachine(thing, this);
		}
	}
}
// (x,y) -> (y,-x)

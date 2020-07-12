import { del } from './del.js';

/**
 * @template T
 */
export class MagicGrid {
	/**
	 * @type {Map<T,[number,number]>}
	 */
	positionMap = new Map();
	/**
	 * @type {T[][]}
	 */
	data = [];
	/**
	 * @type {T[]}
	 */
	itemList = [];

	/**
	 * Gets an item from a position
	 * @param {number} x
	 * @param {number} y
	 * @returns {T|null}
	 */
	get(x, y) {
		if (x in this.data) {
			if (y in this.data[x]) {
				return this.data[x][y];
			}
			return null;
		}
		return null;
	}

	/**
	 * Sets an item in a position
	 * @param {number} x
	 * @param {number} y
	 * @param {T} item
	 */
	set(x, y, item) {
		if (!(x in this.data)) this.data[x] = [];
		if (y in this.data[x]) {
			this.itemList.splice(this.itemList.indexOf(this.data[x][y]), 1);
			this.positionMap.delete(this.data[x][y]);
		}

		this.itemList.push(item);
		this.positionMap.set(item, [x, y]);

		this.data[x][y] = item;
	}

	/**
	 * Removes an item from the grid
	 * @param {number} x
	 * @param {number} y
	 */
	remove(x, y) {
		if (!(x in this.data)) return false;
		if (!(y in this.data[x])) return false;

		this.itemList.splice(this.itemList.indexOf(this.data[x][y]), 1);
		this.positionMap.delete(this.data[x][y]);

		delete this.data[x][y];

		if (this.data[x].reduce((acc, cv) => (cv ? acc + 1 : acc), 0) == 0) {
			delete this.data[x];
		}

		return true;
	}

	/**
	 * Tells you the location of an item
	 * @param {T} item
	 * @returns {[number,number]|null}
	 */
	whereIs(item) {
		if (this.positionMap.has(item)) return this.positionMap.get(item);
		return null;
	}
}

/// <reference path="./Util/types.d.ts" />
const DEV = true;

/**
 * @type {import("./Util/types").globalConf}
 */
globalThis.game = {
	tickSpeed: 500,
	tickSpeedVariance: 10,
	machines: {},
	items: {},
	factory: null,
	platform: typeof window === 'undefined' ? 'node' : 'web',
	globalData: {},
	recipes: [],
};

import('./Recipes/all.js').then((x) => {
	for (let rec in x) {
		game.recipes.push(x[rec]);
	}
});

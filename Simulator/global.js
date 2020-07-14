/// <reference path="./Util/types.d.ts" />
const DEV = true;

/**
 * @type {{
 * 	world: Object[];
 * 	modList: string[];
 * }}
 */
const data = JSON.parse(
	localStorage.factoryData ||
		JSON.stringify({
			world: [],
			modList: [],
		})
);

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
	modList: data.modList,
	funcs: { reloadMods },
};

reloadMods();

async function reloadMods() {
	for (const mod of game.modList) {
		await import(`./Packs/${mod}/pack.js`);
	}
}

addEventListener('unload', () => {
	localStorage.factoryData = JSON.stringify(data);
});

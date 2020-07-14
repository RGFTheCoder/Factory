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
	funcs: { reloadMods, deserializeItem, deserializeMachine, loadFactory },
};

async function reloadMods() {
	for (const mod of game.modList) {
		await import(`./Packs/${mod}/pack.js`);
	}
}
function deserializeItem(data) {
	//@ts-ignore
	return game.items[data.type].deserialize(data);
}

/**
 *
 * @param {Object} data
 * @param {import('./Factory/Factory.js').Factory} factory
 */
function deserializeMachine(data, factory) {
	//@ts-ignore
	return game.machines[data.type].deserialize(data, factory);
}

async function loadFactory() {
	const world = data.world;
	for (let thing of world) {
		deserializeMachine(thing, game.factory);
	}
}

function saveFactory() {
	return game.factory.world.itemList.map((x) => x.serialize());
}

addEventListener('unload', () => {
	data.world = saveFactory();
	localStorage.factoryData = JSON.stringify(data);
});

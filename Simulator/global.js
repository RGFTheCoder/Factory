/// <reference path="./Util/types.d.ts" />

import { deserializeMachine } from './Util/serialize.js';

const DEV = true;
const defSave = JSON.stringify({
	world: [],
	modList: [],
});
/**
 * @type {{
 * 	world: Object[];
 * 	modList: string[];
 * }}
 */
const data = JSON.parse(
	localStorage.factoryData ||
		JSON.stringify({
			default: JSON.parse(defSave),
		})
);

const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);
const save = urlParams.get('save') ?? 'default';

data[save] = data[save] ?? JSON.parse(defSave);

/**
 * @type {import("./Util/types").globalConf}
 */
globalThis.game = {
	DEV: DEV,
	tickSpeed: 20,
	tickSpeedVariance: 10,
	machines: {},
	items: {},
	factory: null,
	platform: typeof window === 'undefined' ? 'node' : 'web',
	globalData: {},
	recipes: [],
	save: save,
	modList: data[save].modList,
	funcs: { reloadMods },
	urlParams: urlParams,
	world: data[save].world,
	structures: [],
};

async function reloadMods() {
	for (const mod of game.modList) {
		await import(`./Packs/${mod}/pack.js`);
	}
}

addEventListener('unload', function onunload() {
	if (urlParams.get('clearData')) {
		delete localStorage.factoryData;
		return;
	}
	data[save].world = game.factory.serialize();

	if (!urlParams.get('noSave')) localStorage.factoryData = JSON.stringify(data);
});

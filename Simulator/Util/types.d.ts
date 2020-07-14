import { Factory } from '../Factory/Factory.js';
import { Item } from '../Item/Item.js';
import { Base } from '../Machine/Base/Base.js';

type Class<T> = new () => T;
type Recipe = {
	type: string;
	name: string;
	work: number;
	input: string[];
	output: Class<Item>[];
};

type globalConf = {
	tickSpeed: number;
	tickSpeedVariance: number;
	machines: {
		[keys: string]: typeof Base;
	};
	items: { [keys: string]: typeof Item };
	factory: Factory | null;
	platform: 'node' | 'web';
	globalData: { [key: string]: any };
	recipes: Recipe[];
	modList: string[];
	funcs: {
		reloadMods(): Promise<void>;
		deserializeItem(data: Object): Item;
		deserializeMachine(data: Object, factory: Factory): Base;
		loadFactory(): Promise<void>;
	};
};
declare namespace NodeJS {
	interface Global {
		game: globalConf;
	}
}
interface Window {
	game: globalConf;
}
interface globalThis {
	game: globalConf;
}

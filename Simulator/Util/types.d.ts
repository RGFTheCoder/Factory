import { Factory } from '../Factory/Factory.js';
import { Item } from '../Item/Item.js';
import { Base } from '../Machine/Base/Base.js';

type Class<T> = new () => T;
type Recipe = {
	type: string;
	input: any;
	output: any;
};

type globalConf = {
	tickSpeed: number;
	tickSpeedVariance: number;
	machines: {
		[keys: string]: new (factory: Factory, x: number, y: number) => Base;
	};
	items: { [keys: string]: Class<Item> };
	factory: Factory | null;
	platform: 'node' | 'web';
	globalData: { [key: string]: any };
	recipes: Recipe[];
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

import { deviate } from '../../../../../Util/random.js';
import { Item } from '../../../../../Item/Item.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class GoldOre extends Item {
	location = currentFolder;

	name = 'GoldOre';
	data = { quality: deviate(0.8, 0.4) };
	tags = ['ore.gold'];
}

game.items['GoldOre'] = GoldOre;

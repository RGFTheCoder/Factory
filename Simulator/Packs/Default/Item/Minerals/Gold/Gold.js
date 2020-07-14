import { deviate } from '../../../../../Util/random.js';
import { Item } from '../../../../../Item/Item.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Gold extends Item {
	location = currentFolder;

	name = 'Gold';
	data = { quality: deviate(0.8, 0.4) };
	tags = ['material.gold', 'mineral.gold', 'machine.atomizer'];
}

game.items['Gold'] = Gold;

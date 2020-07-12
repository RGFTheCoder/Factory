import { deviate } from '../../../Util/random.js';
import { Item } from '../../Item.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Coal extends Item {
	location = currentFolder;

	name = 'Coal';
	data = { quality: deviate(0.8, 0.4) };
	tags = ['material.coal', 'mineral.coal', 'machine.atomizer'];
}

game.items['Coal'] = Coal;

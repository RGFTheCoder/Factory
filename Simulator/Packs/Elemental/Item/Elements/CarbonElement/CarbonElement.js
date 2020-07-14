import { Item } from '../../../../../Item/Item.js';
import { deviate } from '../../../../../Util/random.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class CarbonElement extends Item {
	location = currentFolder;
	prettyName = 'Carbon';
	tags = ['element.carbon'];
}

game.items['CarbonElement'] = CarbonElement;

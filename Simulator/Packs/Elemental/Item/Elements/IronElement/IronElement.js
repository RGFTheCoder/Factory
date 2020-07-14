import { Item } from '../../../../../Item/Item.js';
import { deviate } from '../../../../../Util/random.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class IronElement extends Item {
	location = currentFolder;
	prettyName = 'Iron';
	tags = ['element.carbon'];
}

game.items['IronElement'] = IronElement;

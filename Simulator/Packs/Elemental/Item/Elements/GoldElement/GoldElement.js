import { Item } from '../../../../../Item/Item.js';
import { deviate } from '../../../../../Util/random.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class GoldElement extends Item {
	location = currentFolder;
	prettyName = 'Gold';
	tags = ['element.carbon'];
}

game.items['GoldElement'] = GoldElement;

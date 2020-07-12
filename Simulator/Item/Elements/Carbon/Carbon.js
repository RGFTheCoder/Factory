import { Item } from '../../Item.js';
import { deviate } from '../../../Util/random.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Carbon extends Item {
	location = currentFolder;
	name = 'Carbon';
	tags = ['element.carbon'];
}

game.items['Carbon'] = Carbon;

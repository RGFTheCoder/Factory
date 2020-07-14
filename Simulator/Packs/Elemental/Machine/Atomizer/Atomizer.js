import { Crafter } from '../../../../Machine/Crafter/Crafter.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Atomizer extends Crafter {
	prettyName = 'Atomizer';
	description = 'Breaks things down into base elements.';
	/** @type {{[key:string]:RegExp|'number'|'string'|'item'|'machine'}} */
	editableProps = {
		rotation: /^(0|90|180|270)$/,
	};

	crafterType = 'atomizer';

	location = currentFolder;
}
game.machines['Atomizer'] = Atomizer;

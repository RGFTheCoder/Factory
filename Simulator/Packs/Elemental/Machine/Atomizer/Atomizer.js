import { Crafter } from '../../../../Machine/Crafter/Crafter.js';
import { fixTags } from '../../../../Util/tags.js';

const currentURL = import.meta.url.split('/');
const currentFolder =
	currentURL.slice(0, currentURL.length - 1).join('/') + '/';

export class Atomizer extends Crafter {
	prettyName = 'Atomizer';
	description = 'Breaks things down into base elements.';
	/** @type {{[key:string]:import('../../../../Util/types.js').ViewableTypes}} */
	editableProps = {
		rotation: /^(0|90|180|270)$/,
	};
	tags = fixTags(['machine.atomizer']);

	crafterType = 'atomizer';

	location = currentFolder;
}
game.machines['Atomizer'] = Atomizer;

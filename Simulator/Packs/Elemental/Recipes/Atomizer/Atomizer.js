import { CarbonElement } from '../../Item/Elements/CarbonElement/CarbonElement.js';
import { GoldElement } from '../../Item/Elements/GoldElement/GoldElement.js';

export const coalToCarbon = {
	type: 'atomizer',
	name: 'coalToCarbon',
	work: 5,
	input: ['mineral.coal', 'mineral.coal', 'mineral.coal', 'mineral.coal'],
	output: [
		CarbonElement,
		CarbonElement,
		CarbonElement,
		CarbonElement,
		CarbonElement,
		CarbonElement,
		CarbonElement,
		CarbonElement,
	],
};
game.recipes.push(coalToCarbon);

export const test = {
	type: 'atomizer',
	name: 'test',
	work: 5,
	input: ['mineral.gold'],
	output: [GoldElement],
};
game.recipes.push(test);

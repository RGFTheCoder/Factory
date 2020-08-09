import { Electricity } from '../Item/Electricity/Electricity.js';

export const a = 0;
game.recipes.push({
	input: ['mineral.coal'],
	name: 'coalToElectricity',
	output: [Electricity],
	type: 'CoalGenerator',
	work: 4,
});

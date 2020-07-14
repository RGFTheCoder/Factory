export function deserializeItem(data) {
	return game.items[data.type].deserialize(data);
}

/**
 *
 * @param {Object} data
 * @param {import('../Factory/Factory.js').Factory} factory
 */
export function deserializeMachine(data, factory) {
	//@ts-ignore
	return game.machines[data.type].deserialize(data, factory);
}

import { Item } from '../Item/Item.js';

/**
 * Separates layered tags into parts ie. (['dev.items.defaultItem']) -> (['dev', 'dev.items', 'dev.items.defaultItem'])
 * @param {string[]} tagList The list of tags to fix
 */
export function fixTags(tagList) {
	const out = [];
	for (let baseTag of tagList) {
		const [rootPart, ...parts] = baseTag.split('.');
		let curr = rootPart;
		out.push(curr);
		for (let tagPart of parts) {
			curr += '.' + tagPart;
			out.push(curr);
		}
	}
	return [...new Set(out)];
}

/**
 * Returns a boolean on whether or not all elements of requestedTags are in allTags
 * @param {string[]} allTags
 * @param {string[]} requestedTags
 */
export function compareTags(allTags, requestedTags) {
	return (
		requestedTags.filter((x) => allTags.includes(x)).length ==
		requestedTags.length
	);
}

/**
 * Returns a boolean on whether or not an item has a tag
 * @param {Item} item
 * @param {string} tag
 */
export function hasTag(item, tag) {
	if (item == null) return false;
	// return compareTags(item.tags, fixTags([tag]));
	return compareTags(item.tags, [tag]);
}

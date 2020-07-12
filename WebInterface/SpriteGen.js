function createSpriteGen(prefix = '') {
	/**
	 * @type {{[key:string]:HTMLImageElement}}
	 */
	const cache = {};
	return new Proxy(cache, {
		get(t, p) {
			p = prefix + p.toString();
			if (t[p] == null) {
				t[p] = document.createElement('img');
				t[p].width = 1;
				t[p].height = 1;
				t[p].src = p;
			}

			return t[p];
		},
	});
}

export const sprites = createSpriteGen();

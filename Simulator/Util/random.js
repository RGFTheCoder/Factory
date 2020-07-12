export function deviate(base = 0, deviation = 1) {
	return (Math.random() - Math.random()) * deviation + base;
}

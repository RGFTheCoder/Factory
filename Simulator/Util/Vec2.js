export const TO_DEG = 180 / Math.PI;
export const TO_RAD = Math.PI / 180;

/**
 * @typedef {V2|[number,number]|number} V2Convertible
 */

/**
 * @param {V2Convertible} val
 */
function toV2(val) {
	if (val instanceof V2) {
		return val;
	} else if (typeof val === 'number') {
		const out = new V2();
		out.x = val;
		out.y = val;
		return out;
	} else if (
		val instanceof Array &&
		val.length == 2 &&
		typeof val[0] === 'number' &&
		typeof val[1] === 'number'
	) {
		const out = new V2();
		out.x = val[0];
		out.y = val[1];
		return out;
	}
	return new V2();
}

export class V2 {
	/**
	 * X coordinate of vector
	 */
	x = 0;
	/**
	 * Y coordinate of vector
	 */
	y = 0;

	/**
	 * Radius of vector
	 */
	get radius() {
		return (this.x * this.x + this.y * this.y) ** (1 / 2);
	}

	set radius(rad) {
		const angle = this.theta;
		this.x = Math.cos(angle * TO_RAD) * rad;
		this.y = Math.sin(angle * TO_RAD) * rad;
	}

	/**
	 * Angle/theta of vector in degrees (0 <= X < 360)
	 */
	get theta() {
		return Math.atan2(this.y, this.x) * TO_DEG;
	}

	set theta(angle) {
		const rad = this.radius;
		this.x = Math.cos(angle * TO_RAD) * rad;
		this.y = Math.sin(angle * TO_RAD) * rad;
	}

	static make(p_x, p_y) {
		const out = new V2();
		out.x = p_x;
		out.y = p_y;
		return out;
	}

	/**
	 *
	 * @param {V2Convertible} p_base
	 * @param {V2} target
	 */
	static copy(p_base, target = new V2()) {
		const base = toV2(p_base);
		target.x = base.x;
		target.y = base.y;
		return target;
	}

	/**
	 *
	 * @param {V2Convertible} p_a
	 * @param {V2Convertible} p_b
	 * @param {V2} out
	 */
	static add(p_a, p_b, out = new V2()) {
		const a = toV2(p_a);
		const b = toV2(p_b);
		out.x = a.x + b.x;
		out.y = a.y + b.y;
		return out;
	}

	/**
	 *
	 * @param {V2Convertible} p_a
	 * @param {V2Convertible} p_b
	 * @param {V2} out
	 */
	static sub(p_a, p_b, out = new V2()) {
		const a = toV2(p_a);
		const b = toV2(p_b);
		out.x = a.x - b.x;
		out.y = a.y - b.y;
		return out;
	}

	/**
	 *
	 * @param {V2Convertible} p_a
	 * @param {V2Convertible} p_b
	 * @param {V2} out
	 */
	static mul(p_a, p_b, out = new V2()) {
		const a = toV2(p_a);
		const b = toV2(p_b);
		out.x = a.x * b.x;
		out.y = a.y * b.y;
		return out;
	}

	/**
	 *
	 * @param {V2Convertible} p_a
	 * @param {V2Convertible} p_b
	 * @param {V2} out
	 */
	static div(p_a, p_b, out = new V2()) {
		const a = toV2(p_a);
		const b = toV2(p_b);
		out.x = a.x / b.x;
		out.y = a.y / b.y;
		return out;
	}

	/**
	 *
	 * @param {V2Convertible} p_a
	 * @param {V2Convertible} p_b
	 */
	static dot(p_a, p_b) {
		const a = toV2(p_a);
		const b = toV2(p_b);
		return a.x * b.x + a.y * b.y;
	}
}
// @ts-ignore
window.V2 = V2;

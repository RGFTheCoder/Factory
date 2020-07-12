/// <reference path="../Simulator/Util/types.d.ts" />
/// <reference path="./types.d.ts" />

import { Factory } from '../Simulator/Factory/Factory.js';
import '../Simulator/global.js';
import { Item } from '../Simulator/Item/Item.js';
import '../Simulator/Item/Minerals/Coal/Coal.js';
import '../Simulator/Machine/Atomizer/Atomizer.js';
import '../Simulator/Machine/Conveyor/Conveyor.js';
import '../Simulator/Machine/Dev/Sink/Sink.js';
import '../Simulator/Machine/Source/Source.js';
import '../Simulator/Machine/Storage/InputMover/InputMover.js';
import '../Simulator/Machine/Storage/OmniMover/OmniMover.js';
import '../Simulator/Machine/Storage/OutputMover/OutputMover.js';
import '../Simulator/Machine/Storage/Storage.js';
import { sprites } from './SpriteGen.js';
import { del } from '../Simulator/Util/del.js';
import { Base } from '../Simulator/Machine/Base/Base.js';

const factory = new Factory();
// {
// 	const mach = new Source(factory, 0, 0);
// 	mach.itemType = Coal;
// }
// {
// 	let mach = new Conveyor(factory, 1, 0);
// 	mach.rotations = 1;
// 	mach = new Conveyor(factory, 2, 0);
// 	mach.rotations = 1;
// }
// {
// 	const mach = new Atomizer(factory, 3, 0);
// 	mach.rotations = 1;
// }
// {
// 	let mach = new Conveyor(factory, 4, 0);
// 	mach.rotations = 1;
// }
// {
// 	const mach = new Sink(factory, 5, 0);
// 	mach.rotations = 1;
// }

// {
// 	const mach = new OmniMover(factory, 7, 0);
// 	mach.rotations = 0;
// }

// {
// 	const mach = new InputMover(factory, 7, 2);
// 	mach.rotations = 0;
// }

// {
// 	const mach = new OutputMover(factory, 7, 4);
// 	mach.rotations = 0;
// }
/**
 *
 * @param {Item} item
 */
function getSpriteUrl(item) {
	return item.location + item.name + '.svg';
}

game.factory = factory;

window.sprites = sprites;

const canvas = document.createElement('canvas');
canvas.classList.add('fullFixed');
canvas.width = innerWidth;
canvas.height = innerHeight;
document.body.appendChild(canvas);

addEventListener('resize', () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
});

const ctx = canvas.getContext('2d');

const camera = {
	x: 0,
	dx: 0,
	y: 0,
	dy: 0,
	zoom: 128,
	dzoom: 128,
	speed: 1.2,
	lerp: 0.5,
};

const bounds = {
	get x() {
		return camera.x + -canvas.width / camera.zoom / 2;
		// return -canvas.width / camera.zoom / 2;
	},
	get y() {
		return camera.y + -canvas.height / camera.zoom / 2;
		// return -canvas.height / camera.zoom / 2;
	},
	get w() {
		return canvas.width / camera.zoom;
	},
	get h() {
		return canvas.height / camera.zoom;
	},
};

const mouse = {
	rawx: 0,
	rawy: 0,
	get x() {
		return Math.floor((this.rawx / canvas.width) * bounds.w + bounds.x);
	},
	get y() {
		return Math.floor((this.rawy / canvas.height) * bounds.h + bounds.y);
	},
};

function draw() {
	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	camera.x += (camera.dx - camera.x) * camera.lerp;
	camera.y += (camera.dy - camera.y) * camera.lerp;
	camera.zoom += (camera.dzoom - camera.zoom) * camera.lerp;

	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.scale(camera.zoom, camera.zoom);
	ctx.translate(-camera.x, -camera.y);
	/* DRAW START */

	// ctx.fillRect(bounds.x, bounds.y, bounds.w, bounds.h);
	// ctx.fillRect(bounds.x + 1, bounds.y + 1, bounds.w - 2, bounds.h - 2);

	ctx.save();

	const BGSCALE = 8;
	const bg = sprites[location.origin + '/Simulator/MiscAssets/BG.svg'];
	ctx.scale((1 * BGSCALE) / bg.naturalWidth, (1 * BGSCALE) / bg.naturalHeight);
	ctx.fillStyle = ctx.createPattern(bg, 'repeat');
	ctx.fillRect(
		bounds.x * (bg.naturalWidth / BGSCALE),
		bounds.y * (bg.naturalHeight / BGSCALE),
		bounds.w * (bg.naturalWidth / BGSCALE),
		bounds.h * (bg.naturalHeight / BGSCALE)
	);
	ctx.restore();

	const shownTiles = factory.world.itemList.filter(
		(mach) =>
			mach.xpos > bounds.x - 1 &&
			mach.xpos <= bounds.x + bounds.w &&
			mach.ypos > bounds.y - 1 &&
			mach.ypos <= bounds.y + bounds.h
	);

	for (const tile of shownTiles) {
		ctx.save();
		ctx.translate(tile.xpos + 0.5, tile.ypos + 0.5);
		ctx.rotate((Math.PI / 2) * tile.rotations);
		ctx.translate(-0.5, -0.5);
		tile.draw(ctx, sprites);
		ctx.restore();
	}
	for (const tile of shownTiles) {
		ctx.save();
		ctx.translate(tile.xpos + 0.5, tile.ypos + 0.5);
		ctx.rotate((Math.PI / 2) * tile.rotations);
		ctx.translate(-0.5, -0.5);
		tile.draw2(ctx, sprites);
		ctx.restore();
	}
	for (const tile of shownTiles) {
		ctx.save();
		ctx.translate(tile.xpos + 0.5, tile.ypos + 0.5);
		ctx.rotate((Math.PI / 2) * tile.rotations);
		ctx.translate(-0.5, -0.5);
		tile.draw3(ctx, sprites);
		ctx.restore();
	}

	ctx.fillStyle = '#ff000040';
	ctx.fillRect(mouse.x, mouse.y, 1, 1);

	/* DRAW END */

	ctx.restore();

	/* UI START */
	// ctx.fillStyle = '#ff000080';
	// ctx.fillRect(0, 0, 128, 128);
	/* UI END */

	requestAnimationFrame(draw);
}

draw();

let onCanvas = true;

canvas.addEventListener('mouseenter', () => {
	onCanvas = true;
});
canvas.addEventListener('mouseleave', () => {
	onCanvas = false;
});

addEventListener('keypress', ({ key }) => {
	if (!onCanvas) return;
	if (key == 'w') {
		camera.dy -= 2 ** 6 / camera.zoom;
	} else if (key == 'a') {
		camera.dx -= 2 ** 6 / camera.zoom;
	} else if (key == 's') {
		camera.dy += 2 ** 6 / camera.zoom;
	} else if (key == 'd') {
		camera.dx += 2 ** 6 / camera.zoom;
	} else if (key == 'q') {
		camera.dzoom *= camera.speed;
	} else if (key == 'e') {
		camera.dzoom /= camera.speed;
	}
});
let pressed = false;

canvas.addEventListener('mousemove', (ev) => {
	mouse.rawx = ev.clientX;
	mouse.rawy = ev.clientY;
	pressed ? updateUI('drag') : updateUI('move');
});

canvas.addEventListener('mousedown', (ev) => {
	mouse.rawx = ev.clientX;
	mouse.rawy = ev.clientY;
	pressed = true;
	// const mach = new Source(factory, mouse.x, mouse.y);
	// mach.itemType = Coal;
	updateUI('down');
});
canvas.addEventListener('click', (ev) => {
	mouse.rawx = ev.clientX;
	mouse.rawy = ev.clientY;
	// const mach = new Source(factory, mouse.x, mouse.y);
	// mach.itemType = Coal;
	updateUI('click');
});

canvas.addEventListener('mouseup', (ev) => {
	mouse.rawx = ev.clientX;
	mouse.rawy = ev.clientY;
	pressed = false;
	// const mach = new Source(factory, mouse.x, mouse.y);
	// mach.itemType = Coal;
	updateUI('up');
});

const UI = document.createElement('div');
UI.classList.add('fullFixed');
UI.style['pointer-events'] = 'none';
document.body.appendChild(UI);

/** @type {((type:string)=>void)[]} */
const UIUpdates = [];

function updateUI(type) {
	for (let UIUpdate of UIUpdates) UIUpdate(type);
}

let currentMode = 'edit';

{
	const ToolPanel = document.createElement('div');
	// ToolPanel.hidden = true;
	ToolPanel.classList.add('fixed');
	ToolPanel.classList.add('panel');
	ToolPanel.style['top'] = '0cm';
	ToolPanel.style['right'] = '0cm';
	ToolPanel.style['width'] = '15cm';
	ToolPanel.style['height'] = '1cm';

	const newButton = document.createElement('button');
	const newButtonImage = document.createElement('img');
	newButtonImage.src = '/Simulator/Machine/MiscAssets/New.svg';
	newButton.appendChild(newButtonImage);
	newButton.addEventListener('click', () => {
		currentMode = 'new';
	});

	ToolPanel.appendChild(newButton);
	const editButton = document.createElement('button');
	const editButtonImage = document.createElement('img');
	editButtonImage.src = '/Simulator/Machine/MiscAssets/Edit.svg';
	editButton.appendChild(editButtonImage);
	editButton.addEventListener('click', () => {
		currentMode = 'edit';
	});

	ToolPanel.appendChild(editButton);
	const deleteButton = document.createElement('button');
	const deleteButtonImage = document.createElement('img');
	deleteButtonImage.src = '/Simulator/Machine/MiscAssets/Delete.svg';
	deleteButton.appendChild(deleteButtonImage);
	deleteButton.addEventListener('click', () => {
		currentMode = 'delete';
	});

	ToolPanel.appendChild(deleteButton);

	UI.appendChild(ToolPanel);
}

{
	const MachineList = document.createElement('div');
	MachineList.hidden = true;
	MachineList.classList.add('fixed');
	MachineList.classList.add('panel');
	MachineList.style['top'] = '1cm';
	MachineList.style['left'] = '1cm';
	MachineList.style['width'] = '9cm';
	MachineList.style['height'] = '15cm';
	const title = document.createElement('h1');
	title.textContent = 'Machines';
	MachineList.appendChild(title);
	let selected = Base;
	// @ts-ignore
	let looked = new Base();
	let defProps = {};
	const gallery = document.createElement('div');
	MachineList.appendChild(gallery);
	const params = document.createElement('div');
	MachineList.appendChild(params);

	for (let id in game.machines) {
		const button = document.createElement('button');
		button.textContent = id;
		button.addEventListener('click', () => {
			selected = game.machines[id];
			defProps = {};
			looked.delete();
			// @ts-ignore
			looked = new selected();
			while (params.children.length > 0) params.removeChild(params.firstChild);
			for (let id in looked.editableProps) {
				const data = looked.editableProps[id];
				const item = document.createElement('span');
				const inpu = document.createElement('input');
				const linebreak = document.createElement('br');
				item.append(document.createTextNode(id + ': '));
				switch (data) {
					case 'item': {
						const tempItem = new looked[id]();
						item.append(document.createTextNode('['));
						item.appendChild(inpu);
						item.append(document.createTextNode(']'));

						inpu.value = tempItem.name;

						del(tempItem);
						inpu.addEventListener('keypress', (ev) => {
							const text =
								ev.key == 'Backspace'
									? inpu.value.substr(0, inpu.value.length - 1)
									: inpu.value + ev.key;
							if (text in game.items) {
								inpu.classList.remove('err');
								looked[id] = game.items[text];
								defProps[id] = game.items[text];
							} else {
								inpu.classList.add('err');
							}
						});
						break;
					}
					case 'machine': {
						//TODO
						break;
					}
					case 'number': {
						item.appendChild(inpu);
						inpu.value = looked[id];
						inpu.addEventListener('keypress', (ev) => {
							if (isFinite(Number(inpu.value))) {
								inpu.classList.remove('err');
								looked[id] = Number(inpu.value);
								defProps[id] = Number(inpu.value);
							} else {
								inpu.classList.add('err');
							}
						});
						break;
					}
					case 'string': {
						item.append(document.createTextNode("'"));
						item.appendChild(inpu);
						item.append(document.createTextNode("'"));
						inpu.addEventListener('keypress', (ev) => {
							console.log(ev.key);
							looked[id] = inpu.value;
							defProps[id] = inpu.value;
						});
						inpu.value = looked[id];

						break;
					}
					default: {
						item.append(document.createTextNode('/'));
						item.appendChild(inpu);
						item.append(document.createTextNode('/'));
						inpu.value = looked[id];

						inpu.addEventListener('keydown', (ev) => {
							const text =
								ev.key == 'Backspace'
									? inpu.value.substr(0, inpu.value.length - 1)
									: inpu.value + ev.key;
							if (data.test(text)) {
								inpu.classList.remove('err');
								looked[id] = inpu.value + ev.key;
								defProps[id] = inpu.value + ev.key;
							} else {
								inpu.classList.add('err');
							}
						});
					}
				}
				item.appendChild(linebreak);
				params.appendChild(item);
			}
		});
		gallery.appendChild(button);
	}

	UI.appendChild(MachineList);

	UIUpdates.push((type) => {
		if (currentMode != 'new') MachineList.hidden = true;
		else MachineList.hidden = false;
		if ((type == 'click' || type == 'drag') && currentMode == 'new') {
			if (selected != null) {
				const building = new selected(factory, mouse.x, mouse.y);
				for (let id in defProps) {
					building[id] = defProps[id];
				}
			}
		}
	});
}

{
	const InfoPanel = document.createElement('div');
	InfoPanel.hidden = true;
	InfoPanel.classList.add('fixed');
	InfoPanel.classList.add('panel');
	InfoPanel.style['top'] = '1cm';
	InfoPanel.style['left'] = '1cm';
	InfoPanel.style['width'] = '9cm';
	InfoPanel.style['height'] = '15cm';
	const title = document.createElement('h1');
	title.textContent = 'Base Machine';
	InfoPanel.appendChild(title);
	const id = document.createElement('h3');
	id.textContent = 'Base';
	InfoPanel.appendChild(id);
	const desc = document.createElement('p');
	desc.textContent = 'Base Machine is a machine';
	InfoPanel.appendChild(desc);
	const params = document.createElement('div');
	InfoPanel.appendChild(params);

	UI.appendChild(InfoPanel);

	UIUpdates.push((type) => {
		if (type == 'click') {
			const looked = factory.at(mouse.x, mouse.y);
			if (looked == null || currentMode != 'edit') {
				InfoPanel.hidden = true;
				return;
			}
			title.textContent = looked.prettyName;
			id.textContent = looked.name;
			desc.textContent = looked.description;

			while (params.children.length > 0) params.removeChild(params.firstChild);
			for (let id in looked.editableProps) {
				const data = looked.editableProps[id];
				const item = document.createElement('span');
				const inpu = document.createElement('input');
				const linebreak = document.createElement('br');
				item.append(document.createTextNode(id + ': '));
				switch (data) {
					case 'item': {
						const tempItem = new looked[id]();
						item.append(document.createTextNode('['));
						item.appendChild(inpu);
						item.append(document.createTextNode(']'));

						inpu.value = tempItem.name;

						del(tempItem);
						inpu.addEventListener('keypress', (ev) => {
							const text =
								ev.key == 'Backspace'
									? inpu.value.substr(0, inpu.value.length - 1)
									: inpu.value + ev.key;
							if (text in game.items) {
								inpu.classList.remove('err');
								looked[id] = game.items[text];
							} else {
								inpu.classList.add('err');
							}
						});
						break;
					}
					case 'machine': {
						//TODO
						break;
					}
					case 'number': {
						item.appendChild(inpu);
						inpu.value = looked[id];
						inpu.addEventListener('keypress', (ev) => {
							if (isFinite(Number(inpu.value))) {
								inpu.classList.remove('err');
								looked[id] = Number(inpu.value);
							} else {
								inpu.classList.add('err');
							}
						});
						break;
					}
					case 'string': {
						item.append(document.createTextNode("'"));
						item.appendChild(inpu);
						item.append(document.createTextNode("'"));
						inpu.addEventListener('keypress', (ev) => {
							console.log(ev.key);
							looked[id] = inpu.value;
						});
						inpu.value = looked[id];

						break;
					}
					default: {
						item.append(document.createTextNode('/'));
						item.appendChild(inpu);
						item.append(document.createTextNode('/'));
						inpu.value = looked[id];

						inpu.addEventListener('keydown', (ev) => {
							const text =
								ev.key == 'Backspace'
									? inpu.value.substr(0, inpu.value.length - 1)
									: inpu.value + ev.key;
							if (data.test(text)) {
								inpu.classList.remove('err');
								looked[id] = inpu.value + ev.key;
							} else {
								inpu.classList.add('err');
							}
						});
					}
				}
				item.appendChild(linebreak);
				params.appendChild(item);
			}
			InfoPanel.hidden = false;
		}
	});
}

UIUpdates.push((type) => {
	if ((type == 'click' || type == 'drag') && currentMode == 'delete') {
		factory.removePart(mouse.x, mouse.y);
	}
});

/// <reference path="./Util/types.d.ts" />

// import './global.js';

import { Factory } from './Factory/Factory.js';
import { Coal } from './Item/Minerals/Coal/Coal.js';
import { Atomizer } from './Machine/Atomizer/Atomizer.js';
import { Sink } from './Machine/Dev/Sink/Sink.js';
import { Source } from './Machine/Source/Source.js';

const factory = new Factory();
const devsrc = new Source(factory, 0, 0);
devsrc.itemType = Coal;
const carbonizer = new Atomizer(factory, 1, 0);
const devsnk = new Sink(factory, 2, 0);

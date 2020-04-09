import { me } from 'appbit';
import { readFileSync, writeFileSync } from 'fs';

import type { LocationSlot } from './location-slot';

const SETTINGS_FILE_NAME = 'storage';
const ENCODING = 'cbor';

type State = {
	locationSlots: {
		byName: {
			[name: string]: LocationSlot;
		};
		current?: string;
	};
};

const tryRestore = (): State => {
	try {
		return readFileSync(SETTINGS_FILE_NAME, ENCODING);
	} catch (e) {
		return {
			locationSlots: {
				byName: {},
			},
		};
	}
};

export const state = tryRestore();

me.addEventListener('unload', () => {
	writeFileSync(SETTINGS_FILE_NAME, state, ENCODING);
});

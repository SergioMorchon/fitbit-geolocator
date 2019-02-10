import { readFileSync, writeFileSync } from 'fs';
import { ISettings } from '../models/settings';

const SETTINGS_FILE_NAME = 'settings';
const ENCODING = 'cbor';

const writeSettings = (settings: ISettings) => {
	writeFileSync(SETTINGS_FILE_NAME, settings, ENCODING);
};

const readSettings = (): ISettings => {
	try {
		return readFileSync(SETTINGS_FILE_NAME, ENCODING);
	} catch (e) {
		return {
			locationSlots: [],
		};
	}
};

export default () => {
	let locationSlots = readSettings().locationSlots;

	return {
		get locationSlots() {
			return locationSlots;
		},

		set locationSlots(value) {
			locationSlots = value;
			writeSettings({ locationSlots });
		},
	};
};

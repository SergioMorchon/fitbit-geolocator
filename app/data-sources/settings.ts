import { readFileSync, writeFileSync } from 'fs';
import { ILocation } from '../models/location';
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
			to: undefined,
		};
	}
};

export default () => {
	let to: ILocation | undefined = readSettings().to;

	return {
		get to() {
			return to;
		},

		set to(value) {
			to = value;
			writeSettings({ to });
		},
	};
};

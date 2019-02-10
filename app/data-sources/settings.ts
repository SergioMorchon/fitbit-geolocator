import { readFileSync, writeFileSync } from 'fs';
import { ISettings } from '../models/settings';

const SETTINGS_FILE_NAME = 'settings';
const ENCODING = 'cbor';

const writeSettings = (newSettings: ISettings) => {
	writeFileSync(SETTINGS_FILE_NAME, newSettings, ENCODING);
};

const readSettings = (): ISettings => {
	try {
		return readFileSync(SETTINGS_FILE_NAME, ENCODING);
	} catch (e) {
		return {
			currentLocationSlot: null,
			locationSlots: [],
		};
	}
};

type Listener = () => void;

const getSettings = () => {
	let currentSettings = readSettings();

	const update = () => {
		writeSettings(currentSettings);
		listeners.forEach(listener => listener());
	};

	const listeners: Listener[] = [];

	return {
		get() {
			return currentSettings;
		},
		set(newSettings: ISettings) {
			currentSettings = newSettings;
			update();
		},
		addEventListener(listener: () => void) {
			listeners.push(listener);
		},
	};
};

const settings = getSettings();
export default settings;

import { me } from 'appbit';
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';

const ENCODING = 'cbor';
const SETTINGS_FILE_NAME_V0 = 'storage';

type StateV0 = {
	readonly locationSlots: {
		readonly byName: {
			readonly [name: string]: {
				readonly name: string;
				readonly position: {
					readonly coords: {
						readonly heading: number | null;
						readonly latitude: number;
						readonly longitude: number;
					};
					readonly timestamp: number;
				};
				readonly details: string;
			};
		};
		readonly current?: string;
	};
};

const SETTINGS_FILE_NAME = 'state-1';

const migrateStorage = () => {
	if (existsSync(SETTINGS_FILE_NAME_V0)) {
		try {
			const {
				locationSlots: { byName },
			} = readFileSync(SETTINGS_FILE_NAME_V0, ENCODING) as StateV0;
			writeFileSync(
				SETTINGS_FILE_NAME,
				{
					locations: Object.keys(byName).map(locationName => {
						const {
							name,
							details,
							position: {
								timestamp,
								coords: { heading, longitude, latitude },
							},
						} = byName[locationName];
						return {
							name,
							details,
							coordinates: {
								heading,
								latitude,
								longitude,
							},
							timestamp,
						};
					}),
				},
				'cbor',
			);
		} finally {
			unlinkSync(SETTINGS_FILE_NAME_V0);
		}
	}
};

export interface Coordinates {
	readonly latitude: number;
	readonly longitude: number;
}

export interface Location {
	readonly name: string;
	readonly details: string;
	readonly coordinates: Coordinates;
	readonly timestamp: number;
}

type State = {
	locations: Location[];
};

const tryRestore = (): State => {
	migrateStorage();
	try {
		return readFileSync(SETTINGS_FILE_NAME, ENCODING);
	} catch (e) {
		return {
			locations: [],
		};
	}
};

export const state = tryRestore();

me.addEventListener('unload', () => {
	writeFileSync(SETTINGS_FILE_NAME, state, ENCODING);
});

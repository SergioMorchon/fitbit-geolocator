import { readFileSync, writeFileSync } from 'fs';
import { LocationSlot } from '../../common/models/location-slot';

const SETTINGS_FILE_NAME = 'storage';
const ENCODING = 'cbor';

interface State {
	locationSlots: {
		byName: {
			[name: string]: LocationSlot | undefined;
		};
	};
}

export const loadState = (): State => {
	try {
		return readFileSync(SETTINGS_FILE_NAME, ENCODING) as State;
	} catch (e) {
		return {
			locationSlots: {
				byName: {},
			},
		};
	}
};

export const saveState = (state: State) => {
	writeFileSync(SETTINGS_FILE_NAME, state, ENCODING);
};

export const getLocationSlotByName = (state: State, name: string) =>
	state.locationSlots.byName[name];
export const getLocationSlots = (state: State) =>
	Object.keys(state.locationSlots.byName).map(
		name => state.locationSlots.byName[name] as LocationSlot,
	);

export const addLocationSlot = (state: State, locationSlot: LocationSlot) => {
	state.locationSlots.byName[locationSlot.name] = locationSlot;
};
export const removeLocationSlot = (state: State, name: string) => {
	delete state.locationSlots.byName[name];
};

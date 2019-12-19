import { LocationSlot } from '../../common/models/location-slot';
import {
	ADD_LOCATION_SLOT,
	REMOVE_LOCATION_SLOT,
	SET_CURRENT_LOCATION_SLOT,
} from '../constants/actions/location-slots';

interface State {
	byName: {
		[name: string]: LocationSlot;
	};
	current?: string;
}

export default (
	state: State = {
		byName: {},
	},
	action: any,
): State => {
	switch (action.type) {
		case ADD_LOCATION_SLOT: {
			const { locationSlot } = action.payload;
			return {
				...state,
				byName: {
					...state.byName,
					[locationSlot.name]: locationSlot,
				},
			};
		}
		case REMOVE_LOCATION_SLOT: {
			const { name } = action.payload;
			const byName = { ...state.byName };
			delete byName[name];
			return {
				...state,
				byName,
				current: state.current === name ? undefined : state.current,
			};
		}
		case SET_CURRENT_LOCATION_SLOT: {
			return {
				...state,
				current: action.payload.name,
			};
		}
		default:
			return state;
	}
};

export const getLocationSlotByName = (state: State, name: string) =>
	state.byName[name] || null;
export const getLocationSlots = (state: State) =>
	Object.keys(state.byName).map(name => state.byName[name]);
export const getCurrentLocationSlot = (state: State) =>
	state.current ? state.byName[state.current] : null;

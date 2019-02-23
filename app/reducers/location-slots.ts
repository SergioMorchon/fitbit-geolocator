import {
	ADD_LOCATION_SLOT,
	REMOVE_LOCATION_SLOT,
	SET_CURRENT_LOCATION_SLOT,
} from '../constants/actions/location-slots';
import { ILocationSlot } from '../models/location-slot';

interface IState {
	byName: {
		[name: string]: ILocationSlot;
	};
	current?: string;
}

export default (
	state: IState = {
		byName: {},
	},
	action: any,
): IState => {
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
			const { [name]: _, ...byName } = state.byName;
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

export const getLocationSlotByName = (state: IState, name: string) =>
	state.byName[name] || null;
export const getLocationSlots = (state: IState) =>
	Object.keys(state.byName).map(name => state.byName[name]);
export const getCurrentLocationSlot = (state: IState) =>
	state.current ? state.byName[state.current] : null;

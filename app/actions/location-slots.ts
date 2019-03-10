import { ILocationSlot } from '../../common/models/location-slot';
import {
	ADD_LOCATION_SLOT,
	REMOVE_LOCATION_SLOT,
	SET_CURRENT_LOCATION_SLOT,
} from '../constants/actions/location-slots';

export const setLocationSlot = (locationSlot: ILocationSlot) => ({
	payload: {
		locationSlot,
	},
	type: ADD_LOCATION_SLOT,
});

export const removeLocationSlot = (name: ILocationSlot['name']) => ({
	payload: {
		name,
	},
	type: REMOVE_LOCATION_SLOT,
});

export const setCurrentLocationSlot = (name: ILocationSlot['name']) => ({
	payload: {
		name,
	},
	type: SET_CURRENT_LOCATION_SLOT,
});

import { LocationSlot } from '../../common/models/location-slot';
import {
	ADD_LOCATION_SLOT,
	REMOVE_LOCATION_SLOT,
	SET_CURRENT_LOCATION_SLOT,
} from '../constants/actions/location-slots';

export const setLocationSlot = (locationSlot: LocationSlot) => ({
	payload: {
		locationSlot,
	},
	type: ADD_LOCATION_SLOT,
});

export const removeLocationSlot = (name: LocationSlot['name']) => ({
	payload: {
		name,
	},
	type: REMOVE_LOCATION_SLOT,
});

export const setCurrentLocationSlot = (name: LocationSlot['name']) => ({
	payload: {
		name,
	},
	type: SET_CURRENT_LOCATION_SLOT,
});

import { combineReducers } from 'reduced-state';
import locationSlots from './location-slots';
import * as fromLocationSlots from './location-slots';

const reducer = combineReducers({
	locationSlots,
});

type State = ReturnType<typeof reducer>;
export default reducer;

export const getLocationSlots = (state: State) =>
	fromLocationSlots.getLocationSlots(state.locationSlots);
export const getCurrentLocationSlot = (state: State) =>
	fromLocationSlots.getCurrentLocationSlot(state.locationSlots);
export const getLocationSlotByName = (state: State, name: string) =>
	fromLocationSlots.getLocationSlotByName(state.locationSlots, name);

import { setCurrentLocationSlot } from '../actions/location-slots';
import {
	LOCATION_SLOTS_VIEW,
	NAVIGATION_VIEW,
	NEW_LOCATION_VIEW,
} from '../constants/views';
import store from '../data-sources/state';
import { ILocationSlot } from '../models/location-slot';
import { getLocationSlotByName, getLocationSlots } from '../reducers';
import { getElementById } from '../utils/document';
import { createView, INavigation } from '../utils/views';

export const createLocationSlotsView = (navigation: INavigation) => {
	const view = createView(LOCATION_SLOTS_VIEW);
	const addLocationButton = getElementById(view.root, 'add-location-button');
	const addLocationAction = () => {
		navigation.navigate(NEW_LOCATION_VIEW);
	};
	addLocationButton.onclick = addLocationAction;
	view.onKeyDown = addLocationAction;
	const list = getElementById(
		view.root,
		'location-slots-list',
	) as VirtualTileList<{
		locationSlot: ILocationSlot;
		type: 'location-slots';
	}>;
	list.delegate = {
		configureTile: (tile, { type, locationSlot }) => {
			if (type !== 'location-slots') {
				return;
			}

			const textElement = getElementById(tile, 'text') as TextElement;
			const actionElement = getElementById(tile, 'action') as RectElement;
			textElement.text = locationSlot.name;
			actionElement.onclick = () => {
				store.dispatch(setCurrentLocationSlot(locationSlot.name));
				navigation.navigate(NAVIGATION_VIEW);
			};
		},
		getTileInfo(position) {
			return {
				locationSlot: getLocationSlotByName(
					store.state,
					getLocationSlots(store.state)[position].name,
				),
				type: 'location-slots',
			};
		},
	};
	const update = () => {
		list.length = 0;
		list.length = getLocationSlots(store.state).length;
	};
	store.subscribe(update);

	update();

	return view;
};

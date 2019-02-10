import {
	LOCATION_SLOTS_VIEW,
	NAVIGATION_VIEW,
	NEW_LOCATION_VIEW,
} from '../constants/views';
import settings from '../data-sources/settings';
import { ILocationSlot } from '../models/location-slot';
import { getElementById } from '../utils/document';
import { createView, INavigation } from '../utils/views';

export const createLocationSlotsView = (navigation: INavigation) => {
	const view = createView(LOCATION_SLOTS_VIEW);
	const addLocationButton = getElementById(view.root, 'add-location-button');
	addLocationButton.onclick = () => {
		navigation.navigate(NEW_LOCATION_VIEW);
	};
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
				settings.currentLocationSlot = settings.locationSlots.indexOf(
					locationSlot,
				);
				navigation.navigate(NAVIGATION_VIEW);
			};
		},
		getTileInfo(position) {
			return {
				locationSlot: settings.locationSlots[position],
				type: 'location-slots',
			};
		},
	};
	const update = () => {
		list.length = settings.locationSlots.length;
		list.redraw();
	};
	list.length = settings.locationSlots.length;
	settings.addEventListener(update);

	update();

	return view;
};

import document from 'document';
import { setCurrentLocationSlot } from '../actions/location-slots';
import {
	LOCATION_DETAILS_VIEW,
	LOCATION_SLOTS_VIEW,
	NEW_LOCATION_VIEW,
} from '../constants/views';
import store from '../data-sources/state';
import { ILocationSlot } from '../models/location-slot';
import { getLocationSlotByName, getLocationSlots } from '../reducers';
import { getElementById, hide, show } from '../utils/document';
import i18n from '../utils/i18n';
import { createView, INavigation } from '../utils/views';

export const createLocationSlotsView = (navigation: INavigation) => {
	const view = createView(LOCATION_SLOTS_VIEW);
	const addLocationButton = getElementById(
		document,
		'add-location-button',
	) as ComboButton;
	const locationSlotsEmptyCase = getElementById(
		view.root,
		'location-slots-empty-case',
	) as GraphicsElement;
	(getElementById(
		locationSlotsEmptyCase,
		'empty-case',
	) as TextAreaElement).text = i18n('empty-case');
	const addLocationAction = () => {
		navigation.navigate(NEW_LOCATION_VIEW);
	};
	addLocationButton.onactivate = addLocationAction;
	view.onKeyDown = addLocationAction;
	view.comboButtons = {
		bottomRight: addLocationButton,
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

			(getElementById(tile, 'tile-text') as TextElement).text =
				locationSlot.name;
			(getElementById(tile, 'tile-action') as RectElement).onclick = () => {
				store.dispatch(setCurrentLocationSlot(locationSlot.name));
				navigation.navigate(LOCATION_DETAILS_VIEW);
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
		if (list.length > 0) {
			hide(locationSlotsEmptyCase);
		} else {
			show(locationSlotsEmptyCase);
		}
	};
	store.subscribe(update);

	update();

	return view;
};

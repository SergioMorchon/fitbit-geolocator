import { next } from 'fitbit-views';
import { gettext } from 'i18n';
import { LocationSlot } from '../../common/models/location-slot';
import { setCurrentLocationSlot } from '../actions/location-slots';
import { LOCATION_DETAILS_VIEW, NEW_LOCATION_VIEW } from '../constants/views';
import store from '../data-sources/state';
import { getLocationSlotByName, getLocationSlots } from '../reducers';
import { getElementById, hide, show } from '../utils/document';

export default () => {
	const addLocationButton = getElementById(
		'add-location-button',
	) as ComboButton;
	const locationSlotsEmptyCase = getElementById(
		'location-slots-empty-case',
	) as GraphicsElement;
	(getElementById(
		'empty-case',
		locationSlotsEmptyCase,
	) as TextAreaElement).text = gettext('empty-case');
	const addLocationAction = () => {
		next(NEW_LOCATION_VIEW);
	};
	addLocationButton.onactivate = addLocationAction;
	const list = getElementById('location-slots-list') as VirtualTileList<{
		locationSlot: LocationSlot;
		type: 'location-slots';
	}>;
	list.delegate = {
		configureTile: (tile, { type, locationSlot }) => {
			if (type !== 'location-slots') {
				return;
			}

			(getElementById('tile-text', tile) as TextElement).text =
				locationSlot.name;
			(getElementById('tile-action', tile) as RectElement).onclick = () => {
				store.dispatch(setCurrentLocationSlot(locationSlot.name));
				next(LOCATION_DETAILS_VIEW);
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

	update();
	return store.subscribe(update);
};

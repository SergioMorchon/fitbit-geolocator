import document from 'document';
import { removeLocationSlot } from '../actions/location-slots';
import {
	LOCATION_DETAILS_VIEW,
	LOCATION_SLOTS_VIEW,
	NAVIGATION_VIEW,
} from '../constants/views';
import store from '../data-sources/state';
import { getCurrentLocationSlot } from '../reducers';
import { getElementById } from '../utils/document';
import i18n from '../utils/i18n';
import { positionToString } from '../utils/position';
import { createView, INavigation } from '../utils/views';

export const createLocationDetailsView = (navigation: INavigation) => {
	const view = createView(LOCATION_DETAILS_VIEW);
	const removeLocationButton = getElementById(
		document,
		'remove-location-button',
	) as ComboButton;
	const startNavigationButton = getElementById(
		document,
		'start-navigation-button',
	) as ComboButton;
	const locationDetailsText = getElementById(
		view.root,
		'location-details-text',
	) as TextAreaElement;

	const update = () => {
		const to = getCurrentLocationSlot(store.state);
		if (!to) {
			return;
		}

		locationDetailsText.text = [
			i18n('details-location'),
			positionToString(to.position),
			'',
			i18n('details-timestamp'),
			new Date(to.position.timestamp).toISOString(),
		].join('\n');
	};

	store.subscribe(update);
	removeLocationButton.onactivate = () => {
		const to = getCurrentLocationSlot(store.state);
		if (!to) {
			return;
		}

		store.dispatch(removeLocationSlot(to.name));
		navigation.navigate(LOCATION_SLOTS_VIEW);
	};
	startNavigationButton.onactivate = () => {
		navigation.navigate(NAVIGATION_VIEW);
	};
	view.comboButtons = {
		bottomRight: startNavigationButton,
		topRight: removeLocationButton,
	};
	view.onKeyBack = () => {
		navigation.navigate(LOCATION_SLOTS_VIEW);
	};

	update();
	return view;
};

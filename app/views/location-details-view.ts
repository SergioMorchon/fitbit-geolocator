import document from 'document';
import { gettext } from 'i18n';
import { removeLocationSlot } from '../actions/location-slots';
import {
	LOCATION_DETAILS_VIEW,
	LOCATION_SLOTS_VIEW,
	NAVIGATION_VIEW,
} from '../constants/views';
import store from '../data-sources/state';
import { open as openConfirm } from '../dialogs/confirm';
import { getCurrentLocationSlot } from '../reducers';
import { getElementById } from '../utils/document';
import { positionToString } from '../utils/position';
import { createView, INavigation } from '../utils/views';

export const createLocationDetailsView = (navigation: INavigation) => {
	const view = createView(LOCATION_DETAILS_VIEW);
	let isConfirmDialogOpen = false;
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
			gettext('details-location'),
			positionToString(to.position),
			'',
			gettext('details-timestamp'),
			new Date(to.position.timestamp).toISOString(),
			'',
			gettext('details'),
			to.details,
		].join('\n');
	};

	store.subscribe(update);
	removeLocationButton.onactivate = () => {
		if (isConfirmDialogOpen) {
			return;
		}

		const to = getCurrentLocationSlot(store.state);
		if (!to) {
			return;
		}

		isConfirmDialogOpen = true;
		openConfirm({
			copy: to.name,
			header: gettext('delete-location-header'),
			negative: gettext('delete-location-no'),
			positive: gettext('delete-location-yes'),
		}).then(ok => {
			if (ok) {
				store.dispatch(removeLocationSlot(to.name));
				navigation.navigate(LOCATION_SLOTS_VIEW);
			}

			isConfirmDialogOpen = false;
		});
	};
	startNavigationButton.onactivate = () => {
		if (isConfirmDialogOpen) {
			return;
		}

		navigation.navigate(NAVIGATION_VIEW);
	};
	view.comboButtons = {
		bottomRight: startNavigationButton,
		topRight: removeLocationButton,
	};
	view.onKeyBack = () => {
		if (isConfirmDialogOpen) {
			return;
		}

		navigation.navigate(LOCATION_SLOTS_VIEW);
	};

	update();
	return view;
};

import { back, buttons, next } from 'fitbit-views';
import { gettext } from 'i18n';
import { NAVIGATION } from '../views-names';
import { state } from '../state';
import { open as openConfirm } from './confirm-dialog';
import { byId } from '../utils/document';
import { positionToString } from '../utils/position';
import { LocationSlot } from '../location-slot';

export default (location: LocationSlot) => {
	let isConfirmDialogOpen = false;
	const removeLocationButton = byId('remove-location-button') as ComboButton;
	const startNavigationButton = byId('start-navigation-button') as ComboButton;
	const locationDetailsText = byId('location-details-text') as TextAreaElement;

	const update = () => {
		locationDetailsText.text = [
			gettext('details-location'),
			positionToString(location.position),
			'',
			gettext('details-timestamp'),
			new Date(location.position.timestamp).toISOString(),
			'',
			gettext('details'),
			location.details,
		].join('\n');
	};

	removeLocationButton.onactivate = () => {
		if (isConfirmDialogOpen) {
			return;
		}

		if (!location) {
			return;
		}

		isConfirmDialogOpen = true;
		openConfirm({
			copy: location.name,
			header: gettext('delete-location-header'),
			negative: gettext('delete-location-no'),
			positive: gettext('delete-location-yes'),
		}).then(ok => {
			if (ok) {
				delete state.locationSlots.byName[location.name];
				back();
			}

			isConfirmDialogOpen = false;
		});
	};
	startNavigationButton.onactivate = () => {
		if (isConfirmDialogOpen) {
			return;
		}

		next(NAVIGATION, location);
	};
	buttons.back = () => {
		if (isConfirmDialogOpen) {
			return;
		}

		back();
	};

	update();
};

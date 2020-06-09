import { back, buttons, next } from 'fitbit-views';
import { gettext } from 'i18n';
import { NAVIGATION } from '../views-names';
import { state } from '../state';
import { open as openConfirm } from 'fitbit-widgets/dist/confirm-dialog';
import { byId } from 'fitbit-widgets/dist/document';
import { coordinatesToString } from '../coordinates';

import type { Location } from '../state';

export default (location: Location): void => {
	let isConfirmDialogOpen = false;
	const removeLocationButton = byId('remove-location-button') as ComboButton;
	const startNavigationButton = byId('start-navigation-button') as ComboButton;
	const locationDetailsText = byId('location-details-text') as TextAreaElement;

	const update = () => {
		locationDetailsText.text = [
			gettext('details-location'),
			coordinatesToString(location.coordinates),
			'',
			gettext('details-timestamp'),
			new Date(location.timestamp).toISOString(),
			'',
			gettext('details'),
			location.details,
		].join('\n');
	};

	removeLocationButton.onactivate = () => {
		if (isConfirmDialogOpen) {
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
				state.locations.splice(state.locations.indexOf(location), 1);
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

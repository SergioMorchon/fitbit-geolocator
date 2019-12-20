import { gettext } from 'i18n';
import { LOCATION_DETAILS_VIEW } from '../constants/views';
import { open as openConfirm } from '../dialogs/confirm';
import { getElementById } from '../utils/document';
import { positionToString } from '../utils/position';
import { loadUI, handleBack } from '../ui';
import {
	loadState,
	removeLocationSlot,
	saveState,
} from '../data-sources/state';
import { LocationSlot } from '../../common/models/location-slot';

const goToListView = () =>
	import('./location-slots-view').catch(e => console.error(e));

export default (locationSlot: LocationSlot) => {
	loadUI(LOCATION_DETAILS_VIEW);
	let isConfirmDialogOpen = false;
	const removeLocationButton = getElementById(
		'remove-location-button',
	) as ComboButton;
	const startNavigationButton = getElementById(
		'start-navigation-button',
	) as ComboButton;
	const locationDetailsText = getElementById(
		'location-details-text',
	) as TextAreaElement;

	const update = () => {
		locationDetailsText.text = [
			gettext('details-location'),
			positionToString(locationSlot.position),
			'',
			gettext('details-timestamp'),
			new Date(locationSlot.position.timestamp).toISOString(),
			'',
			gettext('details'),
			locationSlot.details,
		].join('\n');
	};

	removeLocationButton.onactivate = () => {
		if (isConfirmDialogOpen) {
			return;
		}

		isConfirmDialogOpen = true;
		openConfirm({
			copy: locationSlot.name,
			header: gettext('delete-location-header'),
			negative: gettext('delete-location-no'),
			positive: gettext('delete-location-yes'),
		}).then(ok => {
			if (ok) {
				const state = loadState();
				removeLocationSlot(state, locationSlot.name);
				saveState(state);
				goToListView();
				return;
			}

			isConfirmDialogOpen = false;
		});
	};
	startNavigationButton.onactivate = () => {
		if (isConfirmDialogOpen) {
			return;
		}

		import('./navigation-view')
			.then(m => m.default(locationSlot))
			.catch(e => console.error(e));
	};
	handleBack(() => {
		if (isConfirmDialogOpen) {
			return;
		}

		goToListView();
	});

	update();
};

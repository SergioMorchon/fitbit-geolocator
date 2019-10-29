import { back, buttons, next } from 'fitbit-views';
import { gettext } from 'i18n';
import { removeLocationSlot } from '../actions/location-slots';
import { NAVIGATION_VIEW } from '../constants/views';
import store from '../data-sources/state';
import { open as openConfirm } from '../dialogs/confirm';
import { getCurrentLocationSlot } from '../reducers';
import { getElementById } from '../utils/document';
import { positionToString } from '../utils/position';

export default () => {
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
				back();
			}

			isConfirmDialogOpen = false;
		});
	};
	startNavigationButton.onactivate = () => {
		if (isConfirmDialogOpen) {
			return;
		}

		next(NAVIGATION_VIEW);
	};
	buttons.back = () => {
		if (isConfirmDialogOpen) {
			return;
		}

		back();
	};

	update();
	return store.subscribe(update);
};

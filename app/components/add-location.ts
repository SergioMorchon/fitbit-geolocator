import { back, buttons } from 'fitbit-views';
import { geolocation } from 'geolocation';
import { gettext } from 'i18n';
import { state } from '../state';
import { byId } from '../utils/document';
import { positionToString } from '../utils/position';

export default () => {
	const currentLocationText = byId('current-location');
	let position: Position | undefined;
	const update = () => {
		currentLocationText.text = position
			? positionToString(position)
			: gettext('wating-gps');
	};
	buttons.back = () => {
		if (position) {
			const name = positionToString(position);
			state.locationSlots.byName[name] = {
				details: '',
				name,
				position: {
					...position,
					timestamp: Date.now(),
				},
			};
		}

		back();
	};

	const geolocationWatcher = geolocation.watchPosition(newPosition => {
		position = newPosition;
		update();
	});
	update();
	return () => geolocation.clearWatch(geolocationWatcher);
};

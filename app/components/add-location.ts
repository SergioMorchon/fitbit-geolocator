import { back, buttons } from 'fitbit-views';
import { geolocation } from 'geolocation';
import { gettext } from 'i18n';
import { state } from '../state';
import { byId } from 'fitbit-widgets/dist/document';
import { coordinatesToString } from '../coordinates';

import type { Coordinates } from '../state';

export default (): (() => void) => {
	const currentLocationText = byId('current-location');
	let coordinates: Coordinates | undefined;
	const update = () => {
		currentLocationText.text = coordinates
			? coordinatesToString(coordinates)
			: gettext('wating-gps');
	};
	buttons.back = () => {
		if (coordinates) {
			const name = coordinatesToString(coordinates);
			state.locations.push({
				name,
				details: '',
				coordinates,
				timestamp: Date.now(),
			});
		}

		back();
	};

	const geolocationWatcher = geolocation.watchPosition(position => {
		coordinates = position.coords;
		update();
	});
	update();
	return () => geolocation.clearWatch(geolocationWatcher);
};

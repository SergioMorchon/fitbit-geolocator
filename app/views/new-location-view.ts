import { back, buttons } from 'fitbit-views';
import { geolocation } from 'geolocation';
import { gettext } from 'i18n';
import { setLocationSlot } from '../actions/location-slots';
import store from '../data-sources/state';
import { getElementById } from '../utils/document';
import { positionToString } from '../utils/position';

export default () => {
	const currentLocationText = getElementById('current-location') as TextElement;
	let position: Position | null = null;
	const update = () => {
		currentLocationText.text = position
			? positionToString(position)
			: gettext('wating-gps');
	};
	buttons.back = () => {
		if (position) {
			store.dispatch(
				setLocationSlot({
					details: '',
					name: positionToString(position),
					position: {
						...position,
						timestamp: Date.now(),
					},
				}),
			);
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

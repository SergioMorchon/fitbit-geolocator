import { geolocation } from 'geolocation';
import { gettext } from 'i18n';
import { saveState, addLocationSlot, loadState } from '../data-sources/state';
import { getElementById } from '../utils/document';
import { positionToString } from '../utils/position';
import { loadUI, handleBack } from '../ui';
import { NEW_LOCATION_VIEW } from '../constants/views';

loadUI(NEW_LOCATION_VIEW);
const state = loadState();
const currentLocationText = getElementById('current-location') as TextElement;
let position: Position | null = null;
const update = () => {
	currentLocationText.text = position
		? positionToString(position)
		: gettext('wating-gps');
};
const geolocationWatcher = geolocation.watchPosition(newPosition => {
	position = newPosition;
	update();
});
handleBack(() => {
	if (position) {
		addLocationSlot(state, {
			details: '',
			name: positionToString(position),
			position: {
				...position,
				timestamp: Date.now(),
			},
		});
		saveState(state);
		geolocation.clearWatch(geolocationWatcher);
	}
	import('./location-slots-view').catch(e => console.error(e));
});
update();

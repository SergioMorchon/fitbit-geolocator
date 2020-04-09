import { settingsStorage } from 'settings';
import { SettingLocationSlot } from './setting-location-slot';
import { setLocation } from './actions';
import { SET_LOCATION } from './settings-keys';

const processLocation = () => {
	const locationJson = settingsStorage.getItem(SET_LOCATION);
	if (!locationJson) {
		return;
	}

	const location = JSON.parse(locationJson) as SettingLocationSlot;
	setLocation({
		details: location.details,
		name: location.name,
		position: {
			coords: {
				heading: null,
				latitude: location.latitude,
				longitude: location.longitude,
			},
			timestamp: Date.now(),
		},
	});
	settingsStorage.removeItem(SET_LOCATION);
};

settingsStorage.addEventListener('change', processLocation);
processLocation();

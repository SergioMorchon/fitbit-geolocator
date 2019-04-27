import { settingsStorage } from 'settings';
import { SET_LOCATION } from '../common/constants/action-types/messaging';
import { ISettingLocationSlot } from '../common/models/setting-location-slot';
import { setLocation } from './actions';

const processLocation = () => {
	const locationJson = settingsStorage.getItem(SET_LOCATION);
	if (!locationJson) {
		return;
	}

	const location = JSON.parse(locationJson) as ISettingLocationSlot;
	setLocation({
		details: location.details,
		name: location.name,
		position: {
			coords: {
				accuracy: 0,
				altitude: null,
				altitudeAccuracy: null,
				heading: null,
				latitude: location.latitude,
				longitude: location.longitude,
				speed: null,
			},
			timestamp: Date.now(),
		},
	});
	settingsStorage.removeItem(SET_LOCATION);
};

settingsStorage.addEventListener('change', processLocation);
processLocation();

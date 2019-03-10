import { settingsStorage } from 'settings';
import { SET_LOCATION } from '../common/constants/action-types/messaging';
import { ISettingLocationSlot } from '../common/models/setting-location-slot';
import { setLocation } from './actions';

settingsStorage.addEventListener('change', e => {
	if (e.key !== SET_LOCATION) {
		return;
	}

	const locationJson = e.newValue;
	if (!locationJson) {
		return;
	}

	const location = JSON.parse(locationJson) as ISettingLocationSlot;
	setLocation({
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
});

import { settingsStorage } from 'settings';
import { setLocation } from './actions';
import { SET_LOCATION } from './settings-keys';

const processLocation = () => {
	const locationJson = settingsStorage.getItem(SET_LOCATION);
	if (!locationJson) {
		return;
	}

	setLocation(JSON.parse(locationJson));
	settingsStorage.removeItem(SET_LOCATION);
};

settingsStorage.addEventListener('change', processLocation);
processLocation();

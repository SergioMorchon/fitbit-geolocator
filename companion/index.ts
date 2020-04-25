import { encode } from 'cbor';
import { outbox } from 'file-transfer';
import { settingsStorage } from 'settings';
import { SET_LOCATION } from './settings-keys';

import type { Location } from '../app/state';

const setLocation = async (location: Location) => {
	await outbox.enqueue(Date.now().toString(), encode(location));
	settingsStorage.removeItem(SET_LOCATION);
};

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

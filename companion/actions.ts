import { peerSocket } from 'messaging';
import { settingsStorage } from 'settings';
import { SET_LOCATION } from '../common/constants/action-types/messaging';
import {
	SETTINGS_KEY_ADD_LOCATION_LATITUDE,
	SETTINGS_KEY_ADD_LOCATION_LONGITUDE,
	SETTINGS_KEY_ADD_LOCATION_NAME,
} from '../common/constants/settings-keys';
import { ILocationSlot } from '../common/models/location-slot';
import { MessageAction } from '../common/models/messaging-action';

const queue: MessageAction[] = [];

const processQueue = () => {
	if (peerSocket.readyState !== peerSocket.OPEN) {
		return;
	}

	while (queue.length > 0) {
		const message = queue.pop();
		peerSocket.send(message);
	}
};

peerSocket.addEventListener('open', () => processQueue);

const clearSettingsLocation = () => {
	[
		SETTINGS_KEY_ADD_LOCATION_NAME,
		SETTINGS_KEY_ADD_LOCATION_LATITUDE,
		SETTINGS_KEY_ADD_LOCATION_LONGITUDE,
		SET_LOCATION,
	].forEach(settingKey => settingsStorage.removeItem(settingKey));
};

export const setLocation = (location: ILocationSlot) => {
	queue.push([SET_LOCATION, location]);
	processQueue();
	clearSettingsLocation();
};

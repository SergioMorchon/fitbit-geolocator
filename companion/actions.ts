import { peerSocket } from 'messaging';
import { settingsStorage } from 'settings';
import { SET_LOCATION } from '../common/constants/action-types/messaging';
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

export const setLocation = (location: ILocationSlot) => {
	queue.push([SET_LOCATION, location]);
	processQueue();
	settingsStorage.removeItem(SET_LOCATION);
};

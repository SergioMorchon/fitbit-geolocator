import { encode } from 'cbor';
import { outbox } from 'file-transfer';
import { settingsStorage } from 'settings';
import { SET_LOCATION } from '../common/constants/action-types/messaging';
import { ILocationSlot } from '../common/models/location-slot';

export const setLocation = async (location: ILocationSlot) => {
	await outbox.enqueue(Date.now().toString(), encode([SET_LOCATION, location]));
	settingsStorage.removeItem(SET_LOCATION);
};

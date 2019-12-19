import { encode } from 'cbor';
import { outbox } from 'file-transfer';
import { settingsStorage } from 'settings';
import { SET_LOCATION } from '../common/constants/action-types/messaging';
import { LocationSlot } from '../common/models/location-slot';

export const setLocation = async (location: LocationSlot) => {
	await outbox.enqueue(Date.now().toString(), encode([SET_LOCATION, location]));
	settingsStorage.removeItem(SET_LOCATION);
};

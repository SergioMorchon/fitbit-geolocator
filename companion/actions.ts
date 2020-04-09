import { encode } from 'cbor';
import { outbox } from 'file-transfer';
import { settingsStorage } from 'settings';
import type { LocationSlot } from '../app/location-slot';
import { SET_LOCATION } from './settings-keys';

export const setLocation = async (location: LocationSlot) => {
	await outbox.enqueue(Date.now().toString(), encode(location));
	settingsStorage.removeItem(SET_LOCATION);
};

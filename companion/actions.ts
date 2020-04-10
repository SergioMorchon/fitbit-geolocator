import { encode } from 'cbor';
import { outbox } from 'file-transfer';
import { settingsStorage } from 'settings';
import { SET_LOCATION } from './settings-keys';

import type { Location } from '../app/state';

export const setLocation = async (location: Location) => {
	await outbox.enqueue(Date.now().toString(), encode(location));
	settingsStorage.removeItem(SET_LOCATION);
};

import { inbox } from 'file-transfer';
import { readFileSync, unlinkSync } from 'fs';
import { SET_LOCATION } from '../../common/constants/action-types/messaging';
import { MessageAction } from '../../common/models/messaging-action';
import store from '../data-sources/state';
import { setLocationSlot } from './location-slots';

const processFiles = () => {
	let fileName = inbox.nextFile();
	while (fileName) {
		const [action, payload] = readFileSync(
			`/private/data/${fileName}`,
			'cbor',
		) as MessageAction;
		unlinkSync(fileName);
		if (action === 'SET_LOCATION') {
			store.dispatch(setLocationSlot(payload));
		}

		fileName = inbox.nextFile(fileName);
	}
};

processFiles();
inbox.addEventListener('newfile', processFiles);

import { gettext } from 'i18n';
import { LocationSlot } from '../../common/models/location-slot';
import {
	loadState,
	getLocationSlots,
	getLocationSlotByName,
	addLocationSlot,
	saveState,
} from '../data-sources/state';
import { getElementById, hide, show } from '../utils/document';
import { loadUI } from '../ui';
import { LOCATION_SLOTS_VIEW } from '../constants/views';
import { inbox } from 'file-transfer';
import { readFileSync, unlinkSync } from 'fs';
import { MessageAction } from '../../common/models/messaging-action';
import { SET_LOCATION } from '../../common/constants/action-types/messaging';

loadUI(LOCATION_SLOTS_VIEW);
const state = loadState();
const addLocationButton = getElementById('add-location-button') as ComboButton;
const locationSlotsEmptyCase = getElementById(
	'location-slots-empty-case',
) as GraphicsElement;
(getElementById(
	'empty-case',
	locationSlotsEmptyCase,
) as TextAreaElement).text = gettext('empty-case');
const addLocationAction = () => {
	import('./new-location-view').catch(e => console.error(e));
};
addLocationButton.onactivate = addLocationAction;
const list = getElementById('location-slots-list') as VirtualTileList<{
	locationSlot: LocationSlot;
	type: 'location-slots';
}>;
list.delegate = {
	configureTile: (tile, { type, locationSlot }) => {
		if (type !== 'location-slots') {
			return;
		}

		(getElementById('tile-text', tile) as TextElement).text = locationSlot.name;
		(getElementById('tile-action', tile) as RectElement).onclick = () => {
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			dispose();
			import('./location-details-view')
				.then(m => m.default(locationSlot))
				.catch(e => console.error(e));
		};
	},
	getTileInfo(position) {
		return {
			locationSlot: getLocationSlotByName(
				state,
				getLocationSlots(state)[position].name,
			) as LocationSlot,
			type: 'location-slots',
		};
	},
};
const update = () => {
	list.length = 0;
	list.length = getLocationSlots(state).length;
	if (list.length > 0) {
		hide(locationSlotsEmptyCase);
	} else {
		show(locationSlotsEmptyCase);
	}
};

update();

const processFiles = () => {
	let fileName = inbox.nextFile();
	while (fileName) {
		const [action, payload] = readFileSync(
			`/private/data/${fileName}`,
			'cbor',
		) as MessageAction;
		unlinkSync(fileName);
		if (action === SET_LOCATION) {
			addLocationSlot(state, payload);
			saveState(state);
			update();
		}

		fileName = inbox.nextFile(fileName);
	}
};

processFiles();
inbox.addEventListener('newfile', processFiles);

const dispose = () => {
	inbox.removeEventListener('newfile', processFiles);
};

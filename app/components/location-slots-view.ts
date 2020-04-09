import { next } from 'fitbit-views';
import { gettext } from 'i18n';
import { LocationSlot } from '../../common/models/location-slot';
import { LOCATION_DETAILS_VIEW, NEW_LOCATION_VIEW } from '../views-names';
import { byId, hide, show } from '../utils/document';
import { inbox } from 'file-transfer';
import { readFileSync, unlinkSync } from 'fs';
import { MessageAction } from '../../common/models/messaging-action';
import { SET_LOCATION } from '../../common/constants/action-types/messaging';
import { state } from '../state';

const getAllLocationSlots = () =>
	Object.keys(state.locationSlots.byName).map(
		name => state.locationSlots.byName[name],
	);

export default () => {
	const addLocationButton = byId('add-location-button') as ComboButton;
	const locationSlotsEmptyCase = byId(
		'location-slots-empty-case',
	) as GraphicsElement;
	(byId(
		'empty-case',
		locationSlotsEmptyCase,
	) as TextAreaElement).text = gettext('empty-case');
	const addLocationAction = () => {
		next(NEW_LOCATION_VIEW);
	};
	addLocationButton.onactivate = addLocationAction;
	const list = byId('location-slots-list') as VirtualTileList<{
		locationSlot: LocationSlot;
		type: 'location-slots';
	}>;
	list.delegate = {
		configureTile: (tile, { type, locationSlot }) => {
			if (type !== 'location-slots') {
				return;
			}

			(byId('tile-text', tile) as TextElement).text = locationSlot.name;
			(byId('tile-action', tile) as RectElement).onclick = () => {
				next(LOCATION_DETAILS_VIEW, locationSlot);
			};
		},
		getTileInfo(position) {
			return {
				locationSlot: getAllLocationSlots()[position],
				type: 'location-slots',
			};
		},
	};
	const update = () => {
		list.length = 0;
		list.length = getAllLocationSlots().length;
		if (list.length > 0) {
			hide(locationSlotsEmptyCase);
		} else {
			show(locationSlotsEmptyCase);
		}
	};

	const processFiles = () => {
		let fileName = inbox.nextFile();
		while (fileName) {
			const [action, payload] = readFileSync(
				`/private/data/${fileName}`,
				'cbor',
			) as MessageAction;
			unlinkSync(fileName);
			if (action === SET_LOCATION) {
				state.locationSlots.byName[payload.name] = payload;
			}

			fileName = inbox.nextFile(fileName);
		}
		update();
	};

	processFiles();
	inbox.addEventListener('newfile', processFiles);

	update();
	return () => inbox.removeEventListener('newfile', processFiles);
};

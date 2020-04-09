import { next } from 'fitbit-views';
import { gettext } from 'i18n';
import { LocationSlot } from '../location-slot';
import { DETAILS, ADD_LOCATION } from '../views-names';
import { byId, hide, show } from '../utils/document';
import { inbox } from 'file-transfer';
import { readFileSync, unlinkSync } from 'fs';
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
		next(ADD_LOCATION);
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

			byId('tile-text', tile).text = locationSlot.name;
			byId('tile-action', tile).onclick = () => {
				next(DETAILS, locationSlot);
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
			const location = readFileSync(
				`/private/data/${fileName}`,
				'cbor',
			) as LocationSlot;
			unlinkSync(fileName);
			state.locationSlots.byName[location.name] = location;

			fileName = inbox.nextFile(fileName);
		}
		update();
	};

	processFiles();
	inbox.addEventListener('newfile', processFiles);

	update();
	return () => inbox.removeEventListener('newfile', processFiles);
};

import { me } from 'appbit';
import { geolocation } from 'geolocation';
import createSettingsDataSource from '../data-sources/settings';
import { ILocationSlot } from '../models/location-slot';
import { getElementById } from '../utils/document';
import i18n from '../utils/i18n';
import {
	distanceToString,
	getDistance,
	positionToString,
} from '../utils/position';
import { createView } from '../utils/views';

export const createNavigationView = () => {
	const settingsDataSourceStorage = createSettingsDataSource();

	const navigationView = createView('navigation-view');

	const distanceText = getElementById('distance-text') as TextElement;
	const toText = getElementById('to-text') as TextElement;
	const toCurrentPositionButton = getElementById(
		'to-current-position-button',
	) as ComboButton;

	let from: ILocationSlot | undefined;
	let to: ILocationSlot | undefined =
		settingsDataSourceStorage.locationSlots[0];

	const updateTarget = () => {
		toText.text = to ? positionToString(to.position) : i18n('set-target');
	};

	const updateDistance = () => {
		if (!from) {
			distanceText.text = i18n('wating-gps');
			return;
		}

		distanceText.text = to
			? distanceToString(getDistance(from.position, to.position))
			: '---';
	};

	const updateCurrentPositionButton = () => {
		if (from) {
			toCurrentPositionButton.enable();
		} else {
			toCurrentPositionButton.disable();
		}
	};

	const update = () => {
		updateTarget();
		updateDistance();
		updateCurrentPositionButton();
	};

	const self = {
		get from() {
			return from;
		},

		set from(value) {
			from = value;
			update();
		},
		get to() {
			return to;
		},
		set to(value) {
			to = value;
			update();
			if (to) {
				settingsDataSourceStorage.locationSlots = [to];
			}
		},
	};

	toCurrentPositionButton.onclick = () => {
		self.to = self.from;
	};

	if (me.permissions.granted('access_location')) {
		const watcher = geolocation.watchPosition(position => {
			const { latitude, longitude } = position.coords;
			if (latitude === null || longitude === null) {
				return;
			}

			self.from = { name: positionToString(position), position };
		});
		me.addEventListener('unload', () => {
			geolocation.clearWatch(watcher);
		});
	}

	update();

	return navigationView;
};

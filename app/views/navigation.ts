import { me } from 'appbit';
import { geolocation } from 'geolocation';
import createSettingsDataSource from '../data-sources/settings';
import {
	distanceToString,
	getDistance,
	IPoint,
	pointToString,
} from '../models/point';
import { getElementById } from '../utils/document';
import i18n from '../utils/i18n';
import { createView } from '../utils/views';

export const createNavigationView = () => {
	const settingsDataSourceStorage = createSettingsDataSource();

	const navigationView = createView('navigation-view');

	const distanceText = getElementById('distance-text') as TextElement;
	const toText = getElementById('to-text') as TextElement;
	const toCurrentPositionButton = getElementById(
		'to-current-position-button',
	) as ComboButton;

	let from: IPoint | undefined;
	let to: IPoint | undefined = settingsDataSourceStorage.to;

	const updateTarget = () => {
		toText.text = to ? pointToString(to) : i18n('set-target');
	};

	const updateDistance = () => {
		if (!from) {
			distanceText.text = i18n('wating-gps');
			return;
		}

		distanceText.text = to ? distanceToString(getDistance(from, to)) : '---';
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
			settingsDataSourceStorage.to = to;
		},
	};

	toCurrentPositionButton.onclick = () => {
		self.to = self.from;
	};

	if (me.permissions.granted('access_location')) {
		const watcher = geolocation.watchPosition(({ coords }) => {
			const { latitude, longitude } = coords;
			if (latitude === null || longitude === null) {
				return;
			}

			self.from = { latitude, longitude };
		});
		me.addEventListener('unload', () => {
			geolocation.clearWatch(watcher);
		});
	}

	update();

	return navigationView;
};

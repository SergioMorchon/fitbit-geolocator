import { me } from 'appbit';
import { geolocation } from 'geolocation';
import { LOCATION_SLOTS_VIEW, NAVIGATION_VIEW } from '../constants/views';
import settings from '../data-sources/settings';
import { ILocationSlot } from '../models/location-slot';
import { getElementById } from '../utils/document';
import i18n from '../utils/i18n';
import {
	distanceToString,
	getDistance,
	positionToString,
} from '../utils/position';
import { createView, INavigation } from '../utils/views';

const getCurrentTargetPosition = () => {
	if (
		settings.currentLocationSlot === null ||
		!(settings.currentLocationSlot in settings.locationSlots)
	) {
		return null;
	}

	return settings.locationSlots[settings.currentLocationSlot];
};

export const createNavigationView = (navigation: INavigation) => {
	const view = createView(NAVIGATION_VIEW);
	view.onKeyBack = e => {
		e.preventDefault();
		navigation.navigate(LOCATION_SLOTS_VIEW);
	};

	const distanceText = getElementById(
		view.root,
		'distance-text',
	) as TextElement;
	const toText = getElementById(view.root, 'to-text') as TextElement;

	let from: ILocationSlot | undefined;

	const updateTarget = () => {
		const to = getCurrentTargetPosition();
		toText.text = to ? positionToString(to.position) : i18n('set-target');
	};

	const updateDistance = () => {
		if (!from) {
			distanceText.text = i18n('wating-gps');
			return;
		}

		const to = getCurrentTargetPosition();
		distanceText.text = to
			? distanceToString(getDistance(from.position, to.position))
			: '---';
	};

	const update = () => {
		updateTarget();
		updateDistance();
	};

	const self = {
		get from() {
			return from;
		},

		set from(value) {
			from = value;
			update();
		},
	};

	settings.addEventListener(update);
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

	return view;
};

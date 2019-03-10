import { me } from 'appbit';
import { geolocation } from 'geolocation';
import { ILocationSlot } from '../../common/models/location-slot';
import { LOCATION_DETAILS_VIEW, NAVIGATION_VIEW } from '../constants/views';
import store from '../data-sources/state';
import { getCurrentLocationSlot } from '../reducers';
import { getElementById, hide, show } from '../utils/document';
import i18n from '../utils/i18n';
import {
	distanceToString,
	getDistance,
	getFinalBearingProgress,
	positionToString,
} from '../utils/position';
import { createView, INavigation } from '../utils/views';

export const createNavigationView = (navigation: INavigation) => {
	const view = createView(NAVIGATION_VIEW);
	const distanceText = getElementById(
		view.root,
		'distance-text',
	) as TextElement;
	const toText = getElementById(view.root, 'to-text') as TextElement;
	const navigationBearingGroup = getElementById(
		view.root,
		'navigation-bearing',
	) as GroupElement;
	view.onKeyBack = () => {
		navigation.navigate(LOCATION_DETAILS_VIEW);
	};

	let from: ILocationSlot | undefined;

	const updateTarget = (to: ILocationSlot | null) => {
		if (!to) {
			hide(toText);
			return;
		}

		toText.text = positionToString(to.position);
		show(toText);
	};

	const updateOrientation = (to: ILocationSlot | null) => {
		if (!from || !to) {
			hide(navigationBearingGroup);
			return;
		}

		const {
			position: {
				coords: { heading },
			},
		} = from;
		if (
			to &&
			navigationBearingGroup.groupTransform &&
			heading !== null &&
			!isNaN(heading)
		) {
			show(navigationBearingGroup);
			const headingProgress = heading / 360;
			navigationBearingGroup.groupTransform.rotate.angle =
				(getFinalBearingProgress(from.position, to.position) -
					headingProgress) *
				360;
		} else {
			hide(navigationBearingGroup);
		}
	};

	const updateDistance = (to: ILocationSlot | null) => {
		if (!from) {
			distanceText.text = i18n('wating-gps');
			return;
		}

		distanceText.text = to
			? distanceToString(getDistance(from.position, to.position))
			: '---';
	};

	const update = () => {
		const to = getCurrentLocationSlot(store.state);
		updateTarget(to);
		updateDistance(to);
		updateOrientation(to);
	};

	if (me.permissions.granted('access_location')) {
		const watcher = geolocation.watchPosition(position => {
			const { latitude, longitude } = position.coords;
			if (latitude === null || longitude === null) {
				return;
			}

			from = { name: positionToString(position), position };
			update();
		});
		me.addEventListener('unload', () => {
			geolocation.clearWatch(watcher);
		});
	}

	store.subscribe(update);
	update();

	return view;
};

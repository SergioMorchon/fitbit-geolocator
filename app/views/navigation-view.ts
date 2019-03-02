import { me } from 'appbit';
import document from 'document';
import { geolocation } from 'geolocation';
import { removeLocationSlot } from '../actions/location-slots';
import { LOCATION_SLOTS_VIEW, NAVIGATION_VIEW } from '../constants/views';
import store from '../data-sources/state';
import { ILocationSlot } from '../models/location-slot';
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

const getCurrentTargetPosition = () => getCurrentLocationSlot(store.state);

export const createNavigationView = (navigation: INavigation) => {
	const view = createView(NAVIGATION_VIEW);
	const distanceText = getElementById(
		view.root,
		'distance-text',
	) as TextElement;
	const toText = getElementById(view.root, 'to-text') as TextElement;
	const removeLocationButton = getElementById(
		document,
		'remove-location-button',
	) as ComboButton;
	const currentTargetTimestampText = getElementById(
		view.root,
		'current-target-timestamp',
	) as TextAreaElement;
	const navigationBearingGroup = getElementById(
		view.root,
		'navigation-bearing',
	) as GroupElement;
	const container = getElementById(view.root, 'container');
	view.onKeyBack = e => {
		e.preventDefault();
		container.value = 0;
		navigation.navigate(LOCATION_SLOTS_VIEW);
	};
	view.comboButtons = {
		bottomRight: removeLocationButton,
	};

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

		const {
			position: {
				timestamp,
				coords: { heading },
			},
		} = from;
		currentTargetTimestampText.text = new Date(timestamp).toISOString();
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

	const removeAction = () => {
		container.value = 0;
		const to = getCurrentTargetPosition();
		if (to) {
			store.dispatch(removeLocationSlot(to.name));
		}
		navigation.navigate(LOCATION_SLOTS_VIEW);
	};

	removeLocationButton.onactivate = removeAction;
	view.onKeyDown = removeAction;
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

	view.onShow = () => {
		container.value = 0;
	};

	store.subscribe(update);

	update();

	return view;
};

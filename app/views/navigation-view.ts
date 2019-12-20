import { geolocation } from 'geolocation';
import { gettext } from 'i18n';
import { LocationSlot } from '../../common/models/location-slot';
import store from '../data-sources/state';
import { getCurrentLocationSlot } from '../reducers';
import { getElementById, hide, show } from '../utils/document';
import {
	distanceToString,
	getDistance,
	getFinalBearingProgress,
	positionToString,
} from '../utils/position';

export default () => {
	const distanceText = getElementById('distance-text') as TextElement;
	const toText = getElementById('to-text') as TextElement;
	const navigationBearingGroup = getElementById(
		'navigation-bearing',
	) as GroupElement;
	const animationElement = getElementById(
		'animation',
		navigationBearingGroup,
	) as any;

	let from: LocationSlot | undefined;
	let cancellationToken = {
		cancel: false,
	};

	const updateTarget = (to: LocationSlot | null) => {
		if (!to) {
			hide(toText);
			return;
		}

		toText.text = positionToString(to.position);
		show(toText);
	};

	const updateOrientation = (to: LocationSlot | null) => {
		if (!from || !to) {
			hide(navigationBearingGroup);
			return;
		}

		if (to && navigationBearingGroup.groupTransform) {
			cancellationToken.cancel = true;
			cancellationToken = {
				cancel: false,
			};

			show(navigationBearingGroup);
			const headingProgress = (from.position.coords.heading || 0) / 360;
			const currentAngle = navigationBearingGroup.groupTransform.rotate.angle;
			const targetAngle =
				(getFinalBearingProgress(from.position, to.position) -
					headingProgress) *
				360;

			animationElement.from = currentAngle;
			animationElement.to = targetAngle;
			animationElement.animate('enable');
		} else {
			hide(navigationBearingGroup);
		}
	};

	const updateDistance = (to: LocationSlot | null) => {
		if (!from) {
			distanceText.text = gettext('wating-gps');
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

	const geolocationWatcher = geolocation.watchPosition(position => {
		const { latitude, longitude } = position.coords;
		if (latitude === null || longitude === null) {
			return;
		}

		from = { name: positionToString(position), position, details: '' };
		update();
	});

	update();
	const unsubscribeFromStore = store.subscribe(update);
	return () => {
		unsubscribeFromStore();
		geolocation.clearWatch(geolocationWatcher);
	};
};

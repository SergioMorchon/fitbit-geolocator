import { me } from 'appbit';
import { geolocation } from 'geolocation';
import { gettext } from 'i18n';
import animate from 'promise-animate';
import { ILocationSlot } from '../../common/models/location-slot';
import { LOCATION_DETAILS_VIEW, NAVIGATION_VIEW } from '../constants/views';
import store from '../data-sources/state';
import { getCurrentLocationSlot } from '../reducers';
import { getElementById, hide, show } from '../utils/document';
import {
	distanceToString,
	getDistance,
	getFinalBearingProgress,
	positionToString,
} from '../utils/position';
import { createView, INavigation } from '../utils/views';

/*
 * Easy-in-out function creator
 * Credits to https://math.stackexchange.com/a/121755
 */
const createEasyInOut = (factor: number) => (x: number) =>
	x ** factor / (x ** factor + (1 - x) ** factor);

const easyInOut = createEasyInOut(2.5);

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
	let cancellationToken = {
		cancel: false,
	};

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

			let animationFunction: (progress: number) => number;
			if (targetAngle > currentAngle) {
				if (targetAngle - currentAngle <= 180) {
					const angle = targetAngle - currentAngle;
					animationFunction = progress => currentAngle + angle * progress;
				} else {
					const angle = currentAngle + 360 - targetAngle;
					animationFunction = progress => currentAngle + 360 - angle * progress;
				}
			} else {
				if (currentAngle - targetAngle <= 180) {
					const angle = currentAngle - targetAngle;
					animationFunction = progress => currentAngle - angle * progress;
				} else {
					const angle = targetAngle + 360 - currentAngle;
					animationFunction = progress => currentAngle + 360 + angle * progress;
				}
			}

			animate({
				cancellationToken,
				duration: 500,
				update: progress => {
					if (navigationBearingGroup.groupTransform) {
						navigationBearingGroup.groupTransform.rotate.angle = animationFunction(
							easyInOut(progress),
						);
					}
				},
			});
		} else {
			hide(navigationBearingGroup);
		}
	};

	const updateDistance = (to: ILocationSlot | null) => {
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

	if (me.permissions.granted('access_location')) {
		const watcher = geolocation.watchPosition(position => {
			const { latitude, longitude } = position.coords;
			if (latitude === null || longitude === null) {
				return;
			}

			from = { name: positionToString(position), position, details: '' };
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

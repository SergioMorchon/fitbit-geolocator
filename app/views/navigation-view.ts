import { geolocation } from 'geolocation';
import { gettext } from 'i18n';
import animate from 'promise-animate';
import { LocationSlot } from '../../common/models/location-slot';
import { getElementById, hide, show } from '../utils/document';
import {
	distanceToString,
	getDistance,
	getFinalBearingProgress,
	positionToString,
} from '../utils/position';
import { loadUI, handleBack } from '../ui';
import { NAVIGATION_VIEW } from '../constants/views';

/*
 * Easy-in-out function creator
 * Credits to https://math.stackexchange.com/a/121755
 */
const createEasyInOut = (factor: number) => (x: number) =>
	x ** factor / (x ** factor + (1 - x) ** factor);

const easyInOut = createEasyInOut(2.5);

export default (locationSlot: LocationSlot) => {
	loadUI(NAVIGATION_VIEW);
	const distanceText = getElementById('distance-text') as TextElement;
	const toText = getElementById('to-text') as TextElement;
	const navigationBearingGroup = getElementById(
		'navigation-bearing',
	) as GroupElement;

	let from: LocationSlot | undefined;
	let cancellationToken = {
		cancel: false,
	};

	const updateTarget = () => {
		toText.text = positionToString(locationSlot.position);
		show(toText);
	};

	const updateOrientation = () => {
		if (!from) {
			hide(navigationBearingGroup);
			return;
		}

		if (navigationBearingGroup.groupTransform) {
			cancellationToken.cancel = true;
			cancellationToken = {
				cancel: false,
			};

			show(navigationBearingGroup);
			const headingProgress = (from.position.coords.heading || 0) / 360;
			const currentAngle = navigationBearingGroup.groupTransform.rotate.angle;
			const targetAngle =
				(getFinalBearingProgress(from.position, locationSlot.position) -
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

	const updateDistance = () => {
		if (!from) {
			distanceText.text = gettext('wating-gps');
			return;
		}

		distanceText.text = distanceToString(
			getDistance(from.position, locationSlot.position),
		);
	};

	const update = () => {
		updateTarget();
		updateDistance();
		updateOrientation();
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

	handleBack(() => {
		geolocation.clearWatch(geolocationWatcher);
		import('./location-details-view')
			.then(m => m.default(locationSlot))
			.catch(e => console.error(e));
	});
};

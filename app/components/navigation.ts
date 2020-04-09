import { geolocation } from 'geolocation';
import { gettext } from 'i18n';
import animate from 'promise-animate';
import { LocationSlot, Position } from '../location-slot';
import { byId, hide, show } from '../utils/document';
import {
	distanceToString,
	getDistance,
	getFinalBearingProgress,
	positionToString,
} from '../utils/position';
import { buttons, back } from 'fitbit-views';

/*
 * Easy-in-out function creator
 * Credits to https://math.stackexchange.com/a/121755
 */
const createEasyInOut = (factor: number) => (x: number) =>
	x ** factor / (x ** factor + (1 - x) ** factor);

const easyInOut = createEasyInOut(2.5);

export default (target: LocationSlot) => {
	const distanceText = byId('distance-text');
	byId('to-text').text = positionToString(target.position);
	const navigationBearingGroup = byId('navigation-bearing') as GroupElement;

	let from: Position | undefined;
	let cancellationToken = {
		cancel: false,
	};

	const updateOrientation = () => {
		if (!(from && navigationBearingGroup.groupTransform)) {
			hide(navigationBearingGroup);
			return;
		}

		cancellationToken.cancel = true;
		cancellationToken = {
			cancel: false,
		};

		show(navigationBearingGroup);
		const headingProgress = (from.coords.heading || 0) / 360;
		const currentAngle = navigationBearingGroup.groupTransform.rotate.angle;
		const targetAngle =
			(getFinalBearingProgress(from.coords, target.position.coords) -
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
			duration: 300,
			update: progress => {
				if (navigationBearingGroup.groupTransform) {
					navigationBearingGroup.groupTransform.rotate.angle = animationFunction(
						easyInOut(progress),
					);
				}
			},
		});
	};

	const update = () => {
		distanceText.text = from
			? distanceToString(getDistance(from.coords, target.position.coords))
			: gettext('wating-gps');
		updateOrientation();
	};

	const geolocationWatcher = geolocation.watchPosition(position => {
		from = position;
		update();
	});

	buttons.back = () => {
		back(target);
	};

	update();
	return () => geolocation.clearWatch(geolocationWatcher);
};

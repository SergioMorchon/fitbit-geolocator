import { gettext } from 'i18n';
import { units } from 'user-settings';

import type { Coordinates } from './state';

const { distance: distanceUnits } = units;
const EARTH_RADIUS = 6_371_000;
const distanceConfig = {
	metric: {
		long: 1_000,
		longName: gettext('kilometer'),
		short: 1,
		shortName: gettext('meter'),
	},
	us: {
		long: 1_609.344,
		longName: gettext('mile'),
		short: 0.3048,
		shortName: gettext('foot'),
	},
};

const RADIAN = Math.PI / 180;

const SIGNIFICATIVE_DECIMALS = 5;

export const coordinatesToString = ({ latitude, longitude }: Coordinates) =>
	`${latitude.toFixed(SIGNIFICATIVE_DECIMALS)}, ${longitude.toFixed(
		SIGNIFICATIVE_DECIMALS,
	)}`;

const degreesToRadians = (degrees: number) => degrees * RADIAN;

export const getDistance = (from: Coordinates, to: Coordinates) => {
	const φ = degreesToRadians(to.latitude - from.latitude);
	const λ = degreesToRadians(to.longitude - from.longitude);
	const a =
		Math.sin(φ / 2) * Math.sin(φ / 2) +
		Math.sin(λ / 2) *
			Math.sin(λ / 2) *
			Math.cos(degreesToRadians(from.latitude)) *
			Math.cos(degreesToRadians(to.latitude));
	return EARTH_RADIUS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const distanceToString = (distance: number) => {
	const { short, shortName, long, longName } = distanceConfig[distanceUnits];
	const longPart = Math.floor(distance / long);
	const shortPart = Math.floor((distance - longPart * long) / short);
	return `${
		longPart ? `${longPart}${longName}` : ''
	} ${shortPart}${shortName}`.trim();
};

const getBearing = (from: Coordinates, to: Coordinates) => {
	const φ1 = degreesToRadians(from.latitude);
	const λ1 = degreesToRadians(from.longitude);
	const φ2 = degreesToRadians(to.latitude);
	const λ2 = degreesToRadians(to.longitude);
	const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
	const x =
		Math.cos(φ1) * Math.sin(φ2) -
		Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
	return Math.atan2(y, x);
};

const CIRCLE_RADIANS = Math.PI * 2;

export const getFinalBearingProgress = (from: Coordinates, to: Coordinates) =>
	((getBearing(to, from) + Math.PI) % CIRCLE_RADIANS) / CIRCLE_RADIANS;

import { units } from 'user-settings';
import i18n from './i18n';
import { toNum } from './number';

const { distance: distanceUnits } = units;
const EARTH_RADIUS = 6371e3;
const distanceConfig = {
	metric: {
		long: 1e3,
		longName: i18n('kilometer'),
		short: 1,
		shortName: i18n('meter'),
	},
	us: {
		long: 1609.344,
		longName: i18n('mile'),
		short: 0.3048,
		shortName: i18n('foot'),
	},
};

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const positionToString = ({
	coords: { latitude, longitude },
}: Position) => `${toNum(latitude).toFixed(6)}, ${toNum(longitude).toFixed(6)}`;

export const getDistance = (from: Position, to: Position) => {
	const φ = degreesToRadians(
		toNum(to.coords.latitude) - toNum(from.coords.latitude),
	);
	const λ = degreesToRadians(
		toNum(to.coords.longitude) - toNum(from.coords.longitude),
	);
	const a =
		Math.sin(φ / 2) * Math.sin(φ / 2) +
		Math.sin(λ / 2) *
			Math.sin(λ / 2) *
			Math.cos(degreesToRadians(toNum(from.coords.latitude))) *
			Math.cos(degreesToRadians(toNum(to.coords.latitude)));
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

const getBearing = (from: Position, to: Position) => {
	const φ1 = degreesToRadians(from.coords.latitude);
	const λ1 = degreesToRadians(from.coords.longitude);
	const φ2 = degreesToRadians(to.coords.latitude);
	const λ2 = degreesToRadians(to.coords.longitude);
	const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
	const x =
		Math.cos(φ1) * Math.sin(φ2) -
		Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
	return Math.atan2(y, x);
};

const CIRCLE_RADIANS = Math.PI * 2;

export const getFinalBearingProgress = (from: Position, to: Position) =>
	((getBearing(to, from) + Math.PI) % CIRCLE_RADIANS) / CIRCLE_RADIANS;

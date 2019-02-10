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
	const latitudeDistance = degreesToRadians(
		toNum(to.coords.latitude) - toNum(from.coords.latitude),
	);
	const longitudeDistance = degreesToRadians(
		toNum(to.coords.longitude) - toNum(from.coords.longitude),
	);
	const a =
		Math.sin(latitudeDistance / 2) * Math.sin(latitudeDistance / 2) +
		Math.sin(longitudeDistance / 2) *
			Math.sin(longitudeDistance / 2) *
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

import { units } from "user-settings";
import i18n from "../utils/i18n";

export type Point = {
  readonly latitude: number;
  readonly longitude: number;
};

const { distance: distanceUnits } = units;
const EARTH_RADIUS = 6371e3;
const distanceConfig = {
  metric: {
    short: 1,
    shortName: i18n("meter"),
    long: 1e3,
    longName: i18n("kilometer")
  },
  us: {
    short: 0.3048,
    shortName: i18n("foot"),
    long: 1609.344,
    longName: i18n("mile")
  }
};

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const pointToString = ({ latitude, longitude }: Point) =>
  `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

export const getDistance = (from: Point, to: Point) => {
  const latitudeDistance = degreesToRadians(to.latitude - from.latitude);
  const longitudeDistance = degreesToRadians(to.longitude - from.longitude);
  const a =
    Math.sin(latitudeDistance / 2) * Math.sin(latitudeDistance / 2) +
    Math.sin(longitudeDistance / 2) *
      Math.sin(longitudeDistance / 2) *
      Math.cos(degreesToRadians(from.latitude)) *
      Math.cos(degreesToRadians(to.latitude));
  return EARTH_RADIUS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const distanceToString = (distance: ReturnType<typeof getDistance>) => {
  const { short, shortName, long, longName } = distanceConfig[distanceUnits];
  const longPart = Math.floor(distance / long);
  const shortPart = Math.floor((distance - longPart * long) / short);
  return `${
    longPart ? `${longPart}${longName}` : ""
  } ${shortPart}${shortName}`.trim();
};

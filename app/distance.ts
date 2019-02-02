import { Coordinate } from "../common/coordinate";

const EARTH_RADIUS = 6371e3;
const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

export default (from: Coordinate, to: Coordinate) => {
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

export type Point = {
  readonly latitude: number;
  readonly longitude: number;
};

const EARTH_RADIUS = 6371e3;
const KILOMETER = 1e3;

export const pointToString = ({ latitude, longitude }: Point) =>
  `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

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

export const distanceToString = (distance: ReturnType<typeof getDistance>) =>
  distance >= KILOMETER
    ? `${(distance / KILOMETER).toFixed(1)}km`
    : `${distance.toFixed(0)}m`;

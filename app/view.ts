import document from "document";
import { Coordinate } from "../common/coordinate";
import calculateDistance from "./distance";

const getElement = (id: string) => {
  const element = document.getElementById(id);
  if (!element) {
    throw Error(`Element #${id} not fount`);
  }

  return element;
};

const KILOMETER = 1e3;

const formatDistance = (distance: number) =>
  distance >= KILOMETER
    ? `${(distance / KILOMETER).toFixed(3)}km`
    : `${distance.toFixed(0)}m`;

const getCoordinateString = (coordinate: Coordinate | Coordinates | null) => {
  if (!coordinate) {
    return "";
  }

  const { latitude, longitude } = coordinate;
  if (latitude === null || longitude === null) {
    return "";
  }

  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};

export default () => {
  const distanceText = getElement("distance-text") as TextElement;
  const fromText = getElement("from-text") as TextElement;
  const toText = getElement("to-text") as TextElement;

  let to: Coordinate | null = null;
  let from: Coordinates | null = null;

  const getDistance = () => {
    if (!from || !to) {
      return null;
    }

    const { latitude, longitude } = from;
    if (latitude === null || longitude === null) {
      return null;
    }

    return calculateDistance({ latitude, longitude }, to);
  };

  const update = () => {
    fromText.text = getCoordinateString(from);
    toText.text = getCoordinateString(to);

    const distance = getDistance();
    if (distance === null) {
      distanceText.text = "Waiting for GPS";
      return;
    }

    distanceText.text = formatDistance(distance);
  };

  update();

  return {
    get from() {
      return from;
    },
    set from(value) {
      from = value;
      update();
    },
    get to() {
      return to;
    },

    set to(value) {
      to = value;
      update();
    }
  };
};

import { me } from "appbit";
import { peerSocket } from "messaging";
import { geolocation } from "geolocation";
import getDistance from "./distance";
import { Coordinate } from "../common/coordinate";
import document from "document";

const getELement = (id: string) => {
  const element = document.getElementById(id);
  if (!element) {
    throw Error(`Element #${id} not fount`);
  }

  return element;
};

const distanceText = getELement("distance-text") as TextElement;
const fromText = getELement("from-text") as TextElement;
const toText = getELement("to-text") as TextElement;

let to: Coordinate | null = null;
let from: Coordinates | null = null;

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

const updateScreen = () => {
  fromText.text = getCoordinateString(from);
  toText.text = getCoordinateString(to);
  if (!from || !to) {
    return;
  }

  const { latitude, longitude } = from;
  if (latitude === null || longitude === null) {
    return;
  }

  const distance = getDistance({ latitude, longitude }, to);
  distanceText.text = formatDistance(distance);
};

peerSocket.addEventListener("message", e => {
  to = e.data;
  updateScreen();
});

if (me.permissions.granted("access_location")) {
  const watcher = geolocation.watchPosition(
    ({ coords }) => {
      from = coords;
      updateScreen();
    },
    error => {
      console.error(error.message);
    }
  );
  me.addEventListener("unload", () => {
    geolocation.clearWatch(watcher);
  });
}

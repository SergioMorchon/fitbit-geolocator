import { settingsStorage } from "settings";
import { peerSocket } from "messaging";
import {
  LATITUDE_SETTING_NAME,
  LONGITUDE_SETTING_NAME,
  CURRENT_LATITUDE_SETTING_NAME,
  CURRENT_LONGITUDE_SETTING_NAME
} from "../common/constants";
import { geolocation } from "geolocation";
import { Coordinate } from "../common/coordinate";
import { me } from "companion";

const toNum = (value: any) => (value ? Number(value) : 0);

const getTargetCoord = (): Coordinate => ({
  latitude: toNum(settingsStorage.getItem(LATITUDE_SETTING_NAME)),
  longitude: toNum(settingsStorage.getItem(LONGITUDE_SETTING_NAME))
});

const sendTargetCoord = () => {
  if (peerSocket.readyState === peerSocket.OPEN) {
    peerSocket.send(getTargetCoord());
  }
};

peerSocket.addEventListener("open", sendTargetCoord);
settingsStorage.addEventListener("change", sendTargetCoord);

const geolocationWatch = geolocation.watchPosition(
  ({ coords: { latitude, longitude } }) => {
    if (latitude === null || longitude === null) {
      return;
    }

    settingsStorage.setItem(CURRENT_LATITUDE_SETTING_NAME, String(latitude));
    settingsStorage.setItem(CURRENT_LONGITUDE_SETTING_NAME, String(longitude));
  },
  e => {
    console.error(e.message);
  }
);

me.addEventListener("unload", () => {
  geolocation.clearWatch(geolocationWatch);
});

import { me } from "appbit";
import { peerSocket } from "messaging";
import { geolocation } from "geolocation";
import createView from "./view";
import createStorage from "./storage";

const view = createView();
const storage = createStorage();
view.to = storage.target;

peerSocket.addEventListener("message", e => {
  storage.target = e.data;
  view.to = e.data;
});

if (me.permissions.granted("access_location")) {
  const watcher = geolocation.watchPosition(
    ({ coords }) => {
      view.from = coords;
    },
    error => {
      console.error(error.message);
    }
  );
  me.addEventListener("unload", () => {
    geolocation.clearWatch(watcher);
  });
}

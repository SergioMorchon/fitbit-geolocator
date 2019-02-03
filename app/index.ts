import { me } from "appbit";
import { geolocation } from "geolocation";
import createNavigationView from "./views/navigation";
import createStorage from "./data-sources/settings";

const view = createNavigationView();
const storage = createStorage();
view.to = storage.to;
view.onSetCurrentPosition = () => {
  view.to = view.from;
  storage.to = view.to;
};

if (me.permissions.granted("access_location")) {
  const watcher = geolocation.watchPosition(({ coords }) => {
    const { latitude, longitude } = coords;
    if (latitude === null || longitude === null) {
      return;
    }

    view.from = { latitude, longitude };
  });
  me.addEventListener("unload", () => {
    geolocation.clearWatch(watcher);
  });
}

import {
  Point,
  getDistance,
  distanceToString,
  pointToString
} from "../models/point";
import { getElementById } from "../utils/document";
import i18n from "../utils/i18n";

interface NavigationView {
  onSetCurrentPosition: (() => void) | null;
  from: Point | undefined;
  to: Point | undefined;
}

export default () => {
  const distanceText = getElementById("distance-text") as TextElement;
  const toText = getElementById("to-text") as TextElement;
  const toCurrentPositionButton = getElementById(
    "to-current-position-button"
  ) as ComboButton;

  let from: Point | undefined;
  let to: Point | undefined;

  const update = () => {
    if (!to) {
      toText.text = i18n("set-target");
    }

    if (!from) {
      distanceText.text = i18n("wating-gps");
      toCurrentPositionButton.disable();
    } else {
      toCurrentPositionButton.enable();
    }

    if (!(to && from)) {
      return;
    }

    toText.text = pointToString(to);
    distanceText.text = distanceToString(getDistance(from, to));
  };

  const self: NavigationView = {
    onSetCurrentPosition: null,
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

  toCurrentPositionButton.addEventListener("activate", () => {
    if (self.onSetCurrentPosition) {
      self.onSetCurrentPosition();
    }
  });

  update();

  return self;
};

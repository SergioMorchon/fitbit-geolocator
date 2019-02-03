import {
  Point,
  getDistance,
  distanceToString,
  pointToString
} from "../models/point";
import { getElementById } from "../utils/document";

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
      toText.text = "Set a target";
    }

    if (!from) {
      distanceText.text = "Wating for GPS";
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

  toCurrentPositionButton.addEventListener("click", () => {
    if (self.onSetCurrentPosition) {
      self.onSetCurrentPosition();
    }
  });

  return self;
};

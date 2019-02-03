import { readFileSync, writeFileSync } from "fs";
import { Point } from "../models/point";
import { Settings } from "../models/settings";

const SETTINGS_FILE_NAME = "settings";
const ENCODING = "cbor";

const writeSettings = (settings: Settings) => {
  writeFileSync(SETTINGS_FILE_NAME, settings, ENCODING);
};

const readSettings = (): Settings => {
  try {
    return readFileSync(SETTINGS_FILE_NAME, ENCODING);
  } catch (e) {
    return {
      to: undefined
    };
  }
};

export default () => {
  let to: Point | undefined = readSettings().to;

  return {
    get to() {
      return to;
    },

    set to(value) {
      to = value;
      writeSettings({ to });
    }
  };
};

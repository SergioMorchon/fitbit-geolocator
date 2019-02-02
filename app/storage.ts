import { readFileSync, writeFileSync } from "fs";
import { Coordinate } from "../common/coordinate";

const SETTINGS_FILE_NAME = "settings";
const ENCODING = "cbor";

type Settings = {
  target: Coordinate | null;
};

const writeSettings = (settings: Settings) => {
  writeFileSync(SETTINGS_FILE_NAME, settings, ENCODING);
};

const readSettings = (): Settings => {
  try {
    return readFileSync(SETTINGS_FILE_NAME, ENCODING);
  } catch (e) {
    return {
      target: null
    };
  }
};

export default () => {
  let target: Coordinate | null = readSettings().target;

  return {
    get target() {
      return target;
    },

    set target(value) {
      target = value;
      writeSettings({ target });
    }
  };
};

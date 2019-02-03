import { readFileSync, writeFileSync } from "fs";
import { Point } from "../common/point";

const SETTINGS_FILE_NAME = "settings";
const ENCODING = "cbor";

type Settings = {
  to: Point | null;
};

const writeSettings = (settings: Settings) => {
  writeFileSync(SETTINGS_FILE_NAME, settings, ENCODING);
};

const readSettings = (): Settings => {
  try {
    return readFileSync(SETTINGS_FILE_NAME, ENCODING);
  } catch (e) {
    return {
      to: null
    };
  }
};

export default () => {
  let to: Point | null = readSettings().to;

  return {
    get to() {
      return to;
    },

    set to(value) {
      to = value;
      writeSettings({ to: to });
    }
  };
};

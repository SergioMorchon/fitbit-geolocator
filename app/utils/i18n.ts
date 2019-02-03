import { locale } from "user-settings";
import { readFileSync } from "fs";

type Strings =
  | typeof import("../../resources/strings/en.json")
  | typeof import("../../resources/strings/es.json");

const DEFAULT_LANGUAGE = "en";
const ENCODING = "json";

const getStringsFileName = (lang: string) =>
  `/mnt/assets/resources/strings/${lang}.json`;

const getStrings = (): Strings => {
  const [lang] = locale.language.split("-");
  try {
    return readFileSync(getStringsFileName(lang), ENCODING);
  } catch (e) {
    return readFileSync(getStringsFileName(DEFAULT_LANGUAGE), ENCODING);
  }
};

const strings = getStrings();

export default (id: keyof Strings) => strings[id];

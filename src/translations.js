// Translation files
import en from "./translations/en.json"; // English
import es from "./translations/es.json"; // Spanish
import de from "./translations/de.json"; // German
import id from "./translations/id.json"; // Indonesian
import ko from "./translations/ko.json"; // Korean
import zhCn from "./translations/zh-cn.json"; // Mainland Chinese

// Locale settings
import localeEn from "react-intl/locale-data/en";
import localeEs from "react-intl/locale-data/es";
import localeDe from "react-intl/locale-data/de";
import localeId from "react-intl/locale-data/id";
import localeKo from "react-intl/locale-data/ko";
import localeZh from "react-intl/locale-data/zh";

// Moment.js localization
import "moment/locale/es";
import "moment/locale/de";
import "moment/locale/id";
import "moment/locale/ko";
import "moment/locale/zh-cn";

export const messages = {
  en,
  es,
  de,
  id,
  ko,
  zhCn
};

export const localeData = [
  ...localeEn,
  ...localeEs,
  ...localeDe,
  ...localeId,
  ...localeKo,
  ...localeZh
];

import en from "./translations/en.json";
import es from "./translations/es.json";
import ko from "./translations/ko.json";
import zh from "./translations/zh.json";

import localeEn from "react-intl/locale-data/en";
import localeEs from "react-intl/locale-data/es";
import localeKo from "react-intl/locale-data/ko";
import localeZh from "react-intl/locale-data/zh";

export const messages = {
  en,
  es,
  ko,
  zh
};

export const localeData = [...localeEn, ...localeEs, ...localeKo, ...localeZh];

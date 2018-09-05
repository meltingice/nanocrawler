import en from "./translations/en.json";
import fr from "./translations/fr.json";

import localeEn from "react-intl/locale-data/en";
import localeFr from "react-intl/locale-data/fr";
import localeKo from "react-intl/locale-data/ko";
import localeZh from "react-intl/locale-data/zh";

export const messages = {
  en,
  fr
};

export const localeData = [...localeEn, ...localeFr, ...localeKo, ...localeZh];

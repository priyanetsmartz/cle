import { language } from "../../settings";

import englishLang from "../../image/flag/uk.svg";

const config = {
  defaultLanguage: language,
  options: [
    {
      languageId: "english",
      locale: "en",
      text: "En",
      icon: englishLang
    },
    {
      languageId: "arabic",
      locale: "ar",
      text: "عربى",
      icon: englishLang
    }
  ]
};

export function getCurrentLanguage(lang:string) {
  let selecetedLanguage = config.options[0];
  config.options.forEach(langge => {
    if (langge.languageId === lang) {
      selecetedLanguage = langge;
    }
  });
  return selecetedLanguage;
}
export default config;

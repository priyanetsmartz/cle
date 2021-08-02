import React, { useState, useEffect } from 'react';
import HttpsRedirect from 'react-https-redirect';
import { Provider } from 'react-redux'
import { store, history } from "./redux/store";
import { ConfigProvider } from 'antd';
import { IntlProvider } from "react-intl";
import AppLocale from "./languageProvider";
import config, {
  getCurrentLanguage
} from "./containers/LanguageSwitcher/config";
import PublicRoutes from "./router.tsx";
import { getCookie } from "./helpers/session";
import { LanguageContext } from './languageContext';
import(`./CLE-styling.css`)


function App() {
  const language = getCookie('currentLanguage');
  const defaultLang = language ? language : config.defaultLanguage;
  const [value, setValue] = useState(defaultLang);
  const currentAppLocale =
    AppLocale[getCurrentLanguage(value).locale];

  useEffect(() => {
    //  console.log(language);
    if (value && value === 'arabic') import(`./CLE-arabic.css`);
    else import(`./CLE-styling.css`);
  }, [language]);

  return (
    <HttpsRedirect>
      <LanguageContext.Provider value={{ value, setValue }} >
        <ConfigProvider locale={currentAppLocale.antd}  >
          <IntlProvider
            locale={currentAppLocale.locale}
            messages={currentAppLocale.messages}
          >
            <Provider store={store}>
              <PublicRoutes history={history} />
            </Provider>
          </IntlProvider>
        </ConfigProvider>
      </LanguageContext.Provider>
    </HttpsRedirect>
  );
}

export default App;
export { AppLocale };

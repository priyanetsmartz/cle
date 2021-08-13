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
import { Helmet } from "react-helmet";


function App() {
  const language = getCookie('currentLanguage');
  const defaultLang = language ? language : config.defaultLanguage;
  const [value, setValue] = useState(defaultLang);
  const currentAppLocale =
    AppLocale[getCurrentLanguage(value).locale];

  return (
    <HttpsRedirect>
      <LanguageContext.Provider value={{ value, setValue }} >
        <ConfigProvider locale={currentAppLocale.antd}  >
          <IntlProvider
            locale={currentAppLocale.locale}
            messages={currentAppLocale.messages}
          >
            <Provider store={store}>
              {value && value === 'arabic' ?
                <Helmet >
                  <link rel="stylesheet" href="/bootstrap/css/CLE-arabic.css" />
                </Helmet> : null}
              <PublicRoutes history={history} />
            </Provider>
          </IntlProvider>
        </ConfigProvider>
      </LanguageContext.Provider>
    </HttpsRedirect >
  );
}

export default App;
export { AppLocale };

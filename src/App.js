import React, { useState } from 'react';
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


function App() {
  const language = getCookie('currentLanguage');
  const defaultLang = language ? language : config.defaultLanguage;
  const [value, setValue] = useState(defaultLang);
  const currentAppLocale =
    AppLocale[getCurrentLanguage(value).locale];

  return (
    <LanguageContext.Provider value={{ value, setValue }}>
      <ConfigProvider locale={currentAppLocale.antd}>
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
  );
}

export default App;
export { AppLocale };

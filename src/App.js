import React from 'react';
import { Provider } from 'react-redux'
import { store, history } from "./redux/store";
import { ConfigProvider } from 'antd';
import { IntlProvider } from "react-intl";
import AppLocale from "./languageProvider";
import config, {
  getCurrentLanguage
} from "./containers/LanguageSwitcher/config";
import PublicRoutes from "./router";

function App() {
  const currentAppLocale =
    AppLocale[getCurrentLanguage(config.defaultLanguage || "english").locale];
  return (
    <ConfigProvider locale={currentAppLocale.antd}>
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
      >
        <Provider store={store}>
          <PublicRoutes history={history} />
          {/* <LanguageSwitcher /> */}
        </Provider>
      </IntlProvider>
    </ConfigProvider>
  );
}

export default App;
export { AppLocale };

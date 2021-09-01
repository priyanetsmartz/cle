import antdSA from 'antd/lib/locale-provider/en_US';
import appLocaleData from 'antd/lib/locale/ar_EG';
import saMessages from '../locales/ar_SA.json';

const saLang = {
  messages: {
    ...saMessages
  },
  antd: antdSA,
  locale: 'ar-SA',
  data: appLocaleData
};
export default saLang;
import Auth from "./auth/reducer";
import LanguageSwitcher from "./languageSwitcher/reducer";
import App from "./app/reducer";
import Cart from "./cart/productReducer";
import { sessionReducer } from 'redux-react-session'
export default {
    Auth,
    App,
    LanguageSwitcher,
    Cart,
    session: sessionReducer
};

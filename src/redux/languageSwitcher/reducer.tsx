import actions from './actions';
import config from '../../containers/LanguageSwitcher/config';
import { getCookie } from "../../helpers/session";
const initState = {
    language: getCookie('currentLanguage') ? getCookie('currentLanguage') : config.defaultLanguage
};
export default function LanguageReducer(state = initState, action) {
    switch (action.type) {
        case actions.CHANGE_LANGUAGE:
            return { ...state, language: action.language };
        default:
            return state;
    }
    // return state;
}

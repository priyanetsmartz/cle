import actions from './actions';
import config from '../../containers/LanguageSwitcher/config';
const initState = {
    language: config.defaultLanguage
};
export default function LanguageReducer(state = initState, action) {
    switch (action.type) {
        case actions.CHANGE_LANGUAGE:
            return { ...state, language: action.language };
        default:
            return state;
    }
    return state;
}

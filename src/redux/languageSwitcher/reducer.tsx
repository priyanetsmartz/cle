import actions from './actions';

const initState = {
    language: 'english'
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

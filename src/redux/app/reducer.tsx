// import { getDefaultPath } from '../../helpers/urlSync';
import actions, { getView } from './actions';

// const preKeys = getDefaultPath();

const initState = {
  collapsed: window.innerWidth > 1220 ? false : true,
  view: getView(window.innerWidth),
  height: window.innerHeight,
  openDrawer: false,
  // openKeys: preKeys,
  showLogin: false,
  showSignUp: false,
  logoClass: 'normal',
  userType: 1,
  loader: true
};
export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.COLLPSE_CHANGE:
      return { ...state, collapsed: !state.collapsed };
    case actions.COLLPSE_OPEN_DRAWER:
      return { ...state, openDrawer: !state.openDrawer };
    case actions.TOGGLE_ALL:
      if (state.view !== action.view || action.height !== state.height) {
        const height = action.height ? action.height : state.height;
        return {
          ...state,
          collapsed: action.collapsed,
          view: action.view,
          height: height
        };
      }
      break;
    case actions.CHANGE_OPEN_KEYS:
      return { ...state, openKeys: action.openKeys };
    case actions.CHANGE_CURRENT:
      return { ...state, current: action.current };
    case actions.CLOSE_ALL:
      return { ...state, current: [], openKeys: [] };
    case actions.SHOW_SIGHNIN:
      return { ...state, showLogin: action.showLogin };
    case actions.SHOW_HELPUS:
      return { ...state, showHelpus: action.showHelpus };
    case actions.OPEN_SIGN_UP:
      return { ...state, showSignUp: action.showSignUp };
    case actions.LOGO_CLASS:
      return { ...state, logoClass: action.logoClass };
    case actions.SET_TYPE:
      return { ...state, userType: action.userType };
    case actions.SET_CAT:
      return { ...state, setCategory: action.setCategory };
    case actions.MENU_SETUP:
      return { ...state, menuId: action.menuId };
    case actions.SHOW_LOADER:
      return { ...state, loader: action.loader };
    default:
      return state;
  }
  return state;
}


export function getView(width) {
  let newView = 'MobileView';
  if (width > 1220) {
    newView = 'DesktopView';
  } else if (width > 767) {
    newView = 'TabView';
  }
  return newView;
}
const actions = {
  COLLPSE_CHANGE: 'COLLPSE_CHANGE',
  COLLPSE_OPEN_DRAWER: 'COLLPSE_OPEN_DRAWER',
  CHANGE_OPEN_KEYS: 'CHANGE_OPEN_KEYS',
  TOGGLE_ALL: 'TOGGLE_ALL',
  CHANGE_CURRENT: 'CHANGE_CURRENT',

  CLOSE_ALL: 'CLOSE_ALL',
  SHOW_SIGHNIN: 'SHOW_SIGHNIN',
  SHOW_HELPUS: 'SHOW_HELPUS',
  OPEN_SIGN_UP: "OPEN_SIGN_UP",
  CLOSE_SIGN_UP: "CLOSE_SIGN_UP",
  LOGO_CLASS: "LOGO_CLASS",
  SET_TYPE: "SET_TYPE",
  SET_CAT: "SET_CAT",
  MENU_SETUP: "MENU_SETUP",
  SHOW_LOADER: "SHOW_LOADER",

  toggleCollapsed: () => ({
    type: actions.COLLPSE_CHANGE
  }),
  toggleAll: (width, height) => {
    const view = getView(width);
    const collapsed = view !== 'DesktopView';
    return {
      type: actions.TOGGLE_ALL,
      collapsed,
      view,
      height
    };
  },
  toggleOpenDrawer: () => ({
    type: actions.COLLPSE_OPEN_DRAWER
  }),
  changeOpenKeys: openKeys => ({
    type: actions.CHANGE_OPEN_KEYS,
    openKeys
  }),
  changeCurrent: current => ({
    type: actions.CHANGE_CURRENT,
    current
  }),
  closeAll: () => ({ type: actions.CLOSE_ALL }),
  showSignin: showLogin => ({
    type: actions.SHOW_SIGHNIN,
    showLogin
  }),
  showHelpus: showHelpus => ({
    type: actions.SHOW_HELPUS,
    showHelpus
  }),
  openSignUp: showSignUp => ({
    type: actions.OPEN_SIGN_UP,
    showSignUp
  }),
  closeSignUp: (payload) => ({
    type: actions.CLOSE_SIGN_UP,
    payload: payload
  }),
  logoClass: logo => ({
    type: actions.LOGO_CLASS,
    logo
  }),
  userType: userType => ({
    type: actions.SET_TYPE,
    userType
  }),
  setCategory: setCategory => ({
    type: actions.SET_CAT,
    setCategory
  }),
  menuSetup: menuId => ({
    type: actions.MENU_SETUP,
    menuId
  }),
  showLoader: loader => ({
    type: actions.SHOW_LOADER,
    loader
  })
};
export default actions;

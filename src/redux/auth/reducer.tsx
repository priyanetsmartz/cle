import actions from "./actions";

const initState = { idToken: null, loading: false };

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.LOGIN_REQUEST:
      return { ...state, loading: true };
    case actions.LOGIN_SUCCESS:
      return { ...state, idToken: action.token, loading: false, userInfo: action.userInfo };
    case actions.LOGIN_ERROR:
      return { ...state, loading: false };
    case actions.LOGOUT:
      return initState;
    case actions.REGISTER_REQUEST:
      return { ...state, loading: true };
    case actions.REGISTER_SUCCESS:
      return { ...state, idToken: action.token, loading: false };
    case actions.REGISTER_AFTER:
      return { ...state, idToken: null, loading: false };
    case actions.REGISTER_ERROR:
      return { ...state, loading: false };
    case actions.GET_GLOBALAUTH:
      return { ...state, globalAuth: action.token, loading: false };
    case actions.VENDOR_DATA:
      return { ...state, vendorr: action.token };
    default:
      return state;
  }
}

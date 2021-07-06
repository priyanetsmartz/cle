import actions from "./actions";

const initState = { idToken: null, loading: false };

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.LOGIN_REQUEST:
      return { ...state, loading: true };
    case actions.LOGIN_SUCCESS:
      return { ...state, idToken: action.token, loading: false };
    case actions.LOGIN_ERROR:
      return { ...state, loading: false };
    case actions.LOGOUT:
      return initState;
    default:
      return state;
  }
}

export interface Payload {
  type: string;
  userInfo: {
    email: string;
    password: string;
  }
}

const actions = {
  CHECK_AUTHORIZATION: "CHECK_AUTHORIZATION",
  LOGIN_REQUEST: "LOGIN_REQUEST",
  LOGOUT: "LOGOUT",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_ERROR: "LOGIN_ERROR",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
  POST_COMMENTS: "POST_COMMENTS",
  REGISTER_REQUEST: "REGISTER_REQUEST",
  REGISTER_ERROR: "REGISTER_ERROR",
  OPEN_SIGN_UP: "OPEN_SIGN_UP",
  CLOSE_SIGN_UP: "CLOSE_SIGN_UP",

  checkAuthorization: () => ({ type: actions.CHECK_AUTHORIZATION }),
  login: (payload: Payload) => ({
    type: actions.LOGIN_REQUEST,
    payload
  }),
  logout: () => ({
    type: actions.LOGOUT
  }),
  forgotPassowd: payload => ({
    type: actions.FORGOT_PASSWORD,
    payload
  }),
  postComment: payload => ({
    type: actions.POST_COMMENTS,
    payload
  }),
  register: (payload: Payload) => ({
    type: actions.REGISTER_REQUEST,
    payload
  }),
  openSignUp: (payload) => ({
    type: actions.OPEN_SIGN_UP,
    payload:payload
  }),
  closeSignUp: (payload) => ({
    type: actions.CLOSE_SIGN_UP,
    payload:payload
  })
};


export default actions;

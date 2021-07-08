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
  REGISTER_REQUEST:"REGISTER_REQUEST",
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
  })
};


export default actions;

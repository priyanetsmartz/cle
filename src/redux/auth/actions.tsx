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
  RESET_PASSWORD: "RESET_PASSWORD",
  POST_COMMENTS: "POST_COMMENTS",
  REGISTER_REQUEST: "REGISTER_REQUEST",
  REGISTER_ERROR: "REGISTER_ERROR",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  GET_GLOBALAUTH: "GET_GLOBALAUTH",
  REGISTER_AFTER: "REGISTER_AFTER",
  VENDOR_DATA:"VENDOR_DATA",

  checkAuthorization: () => ({ type: actions.CHECK_AUTHORIZATION }),
  login: (payload: Payload) => ({
    type: actions.LOGIN_REQUEST,
    payload
  }),
  loginSuccess: token => ({
    type: actions.LOGIN_SUCCESS,
    token
  }),
  logout: () => ({
    type: actions.LOGOUT
  }),
  forgotPassowd: payload => ({
    type: actions.FORGOT_PASSWORD,
    payload
  }),
  resetPassword: payload => ({
    type: actions.RESET_PASSWORD,
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
  getglobalauth: (payload: Payload) => ({
    type: actions.GET_GLOBALAUTH,
    payload
  }),
  vendorrrr: (payload: Payload) => ({
    type: actions.VENDOR_DATA,
    payload
  })
};


export default actions;

const userInfo ={
  
}
const actions = {
  CHECK_AUTHORIZATION: "CHECK_AUTHORIZATION",
  LOGIN_REQUEST: "LOGIN_REQUEST",
  LOGOUT: "LOGOUT",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_ERROR: "LOGIN_ERROR",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
  checkAuthorization: () => ({ type: actions.CHECK_AUTHORIZATION }),
  login: payload => ({
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
};


export default actions;

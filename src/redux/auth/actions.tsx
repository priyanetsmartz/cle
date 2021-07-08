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
  REGISTER_REQUEST:"REGISTER_REQUEST",
  checkAuthorization: () => ({ type: actions.CHECK_AUTHORIZATION }),
  login: (payload: Payload) => ({
    type: actions.LOGIN_REQUEST,
    payload
  }),
  logout: () => ({
    type: actions.LOGOUT
  }),
  register: (payload: Payload) => ({
    type: actions.REGISTER_REQUEST,
    payload
  })
};


export default actions;

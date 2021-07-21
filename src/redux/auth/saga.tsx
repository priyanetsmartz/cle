import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import { push } from "react-router-redux";
import actions from "./actions";
import Login from "./Login";
import notification from "../../components/notification";

import { setCookie, removeCookie } from "../../helpers/session";
const loginApi = new Login();

export function* loginRequest() {

  yield takeEvery("LOGIN_REQUEST", function* (payload: any) {
    try {
      console.log(payload.payload.userInfo);
      //user details
      var type = payload.payload.userInfo.type;
      var email = payload.payload.userInfo.email;
      var password = payload.payload.userInfo.password;
      var userInfo = payload.payload.userInfo;
      //API call to login request
      const response = yield call(loginApi.login, email, password, type);
      if (response.data !== "") {
        yield put({
          type: actions.LOGIN_SUCCESS,
          token: response.data,
          userInfo: payload.payload.userInfo,
          // token: response.id,
          // history: payload.payload.history
        });
        //Check if remember me is clicked
        if (userInfo) {
          if (userInfo.rememberme === true) {
            //set username and password and remember me into cookie
            yield setCookie("username", userInfo.email);
            yield setCookie("password", userInfo.password);
            yield setCookie("remember_me", userInfo.rememberme);
          } else {
            //remove username and password and remember me from cookie
            removeCookie("username");
            removeCookie("password");
            removeCookie("remember_me");
          }
        }
        //     yield setCookie("id_token", response.data);
        localStorage.setItem('id_token', response.data);
        yield put(push("/"));
      } else {
        notification("error", "", "Invalid Username or password.");
        yield put({ type: actions.LOGIN_ERROR });
      }
    } catch (e) {
      notification("error", "", "Invalid email or password.");
      yield put({ type: actions.LOGIN_ERROR });
    }
  });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function* () { });
}


export function* registerRequest() {
  yield takeEvery("REGISTER_REQUEST", function* (payload: any) {
    try {
      //user details
      var firstname = payload.payload.userInfo.firstname ? payload.payload.userInfo.firstname : "magento";
      var type = payload.payload.userInfo.type;
      var email = payload.payload.userInfo.email;
      var password = payload.payload.userInfo.password;
      // var rememberMe = payload.payload.userInfo.rememberMe;
      //API call to login request
      const response = yield call(loginApi.register, firstname, email, password, type);
      if (response.data.id !== "") {
        //  yield put(push("/"));
        notification("success", "", "Account registered successfully");
        yield put({ type: actions.REGISTER_SUCCESS, token: response.data.id });
        localStorage.setItem('id_token', response.data.id);
        yield put(push("/"));
      } else {
        notification("error", "", "Invalid email or password.");
        yield put({ type: actions.REGISTER_ERROR });
      }
    } catch (e) {
      if (e && e.data.message) {
        notification("error", "", e.data.message);
      }
      yield put({ type: actions.REGISTER_ERROR });
    }
  });
}
export function* registerError() {
  yield takeEvery(actions.REGISTER_ERROR, function* () { });
}


export function* registerSuccess() {
  yield takeEvery(actions.REGISTER_SUCCESS, function* () { });
}



export default function* rootSaga() {
  yield all([
    fork(loginRequest),
    fork(registerRequest),
    fork(loginError),
    fork(registerError),
    fork(registerSuccess)
  ]);
}

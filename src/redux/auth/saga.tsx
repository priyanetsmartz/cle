import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import { push } from "react-router-redux";
import actions from "./actions";
import appAction from "../app/actions"
import Login from "./Login";
import notification from "../../components/notification";
import { useHistory } from "react-router";

import { setCookie, removeCookie } from "../../helpers/session";
const loginApi = new Login();

export function* loginRequest() {

  yield takeEvery("LOGIN_REQUEST", function* (payload: any) {
    try {
      //   console.log(payload.payload.userInfo);
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
          userInfo: payload.payload.userInfo
        });
        //Check if remember me is clicked
        if (userInfo) {
          const token = yield call(loginApi.getAuthRegister, userInfo.email);
          if (token.data[0].entity_id) localStorage.setItem('cust_id', token.data[0].entity_id); //store customer id
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
          // token.data[0].group_id = "3";
         
          
          localStorage.setItem('id_token', response.data);
          yield put({
            type: appAction.SHOW_SIGHNIN,
            showLogin: false
          });
          yield put({
            type: appAction.SHOW_HELPUS,
            showHelpus: true
          });
          if(token.data[0].group_id === "3"){
            yield put(push("/prive-user"));
          }else{
            yield put(push("/"));
          }
        }
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
      let firstname = payload.payload.userInfo.first_name;
      let lastname = payload.payload.userInfo.last_name;
      let type = payload.payload.userInfo.type;
      let email = payload.payload.userInfo.email;
      let password = payload.payload.userInfo.password;
      let storeId = payload.payload.userInfo.storeId;
      // var rememberMe = payload.payload.userInfo.rememberMe;
      //API call to login request
      const response = yield call(loginApi.register, firstname, lastname, email, password, type, storeId);
      if (response.data.id !== "") {
        const token = yield call(loginApi.getAuthRegister, email);
        //  console.log(token.data[0].new_token, console.log(typeof (token)))
        if (token.data[0].new_token) {
          yield put({ type: appAction.OPEN_SIGN_UP, showSignUp: false });
          yield put({
            type: actions.LOGIN_SUCCESS,
            token: token.data[0].new_token,
            userInfo: payload.payload.userInfo
          });
          notification("success", "", "Account registered");
          localStorage.setItem('id_token', token.data[0].new_token);
          localStorage.setItem('cust_id', token.data[0].entity_id);
          yield setCookie("username", token.data[0].email);
          if(token.data[0].group_id === "3"){
            yield put(push("/prive-user"));
          }else{
            yield put(push("/"));
          }
          
        } else {
          yield put({ type: actions.REGISTER_ERROR });
          yield put({ type: appAction.OPEN_SIGN_UP, showSignUp: false });
        }

      } else {
        notification("error", "", "Invalid email or password.");
        yield put({ type: actions.REGISTER_ERROR });
        yield put({ type: appAction.OPEN_SIGN_UP, showSignUp: false });
      }
    } catch (e) {
      if (e && e.data.message) {
        notification("error", "", e.data.message);
      }
      yield put({ type: appAction.OPEN_SIGN_UP, showSignUp: false });
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

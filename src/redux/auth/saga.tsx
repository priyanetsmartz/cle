import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import { push } from "react-router-redux";
import actions from "./actions";
import appAction from "../app/actions"
import Login from "./Login";
import notification from "../../components/notification";
import { sessionService } from 'redux-react-session';
import { setCookie, removeCookie, getCookie } from "../../helpers/session";
import { apiConfig } from '../../settings';
var CryptoJS = require("crypto-js");
const loginApi = new Login();

export function* loginRequest() {

  yield takeEvery("LOGIN_REQUEST", function* (payload: any) {
    try {
      // console.log(payload.payload.userInfo);
      //user details
      var type = payload.payload.userInfo.group_id;
      var email = payload.payload.userInfo.email;
      var password = payload.payload.userInfo.password;
      var userInfo = payload.payload.userInfo;
      //API call to login request
      const response = yield call(loginApi.login, email, password, type);
      if (response.data !== "" && !response.data.message) {
        //Check if remember me is clicked
        if (userInfo) {
          const token = yield call(loginApi.getAuthRegister, userInfo.email);

          let id_token = response.data;
          let data = {
            'cust_id': token.data[0].entity_id,
            'token_email': token.data[0].email,
            'token_name': token.data[0].firstname + ' ' + token.data[0].lastname,
            'token': token.data[0].group_id,
            'id_token': response.data
          }
          const cartToken = yield call(loginApi.genCartQuoteID, token.data[0].entity_id);
          // console.log(cartToken);
          if (cartToken.data === true) {
            localStorage.removeItem('cartQuoteToken');
          } else {
            localStorage.setItem('cartQuoteId', cartToken.data);
          }
          sessionService.saveSession({ id_token })
          sessionService.saveUser(data)
          yield put({
            type: actions.LOGIN_SUCCESS,
            token: response.data,
            userInfo: {
              group_id: token.data[0].group_id,
              survey: getCookie('help-us')
            }
          });
          if (userInfo.rememberme === true) {
            let ciphertext = CryptoJS.AES.encrypt(userInfo.password, apiConfig.encryptionkey).toString();
            //  console.log(ciphertext);

            //set username and password and remember me into cookie
            yield setCookie("username", userInfo.email);
            yield setCookie("password", ciphertext);
            yield setCookie("remember_me", userInfo.rememberme);

          } else {
            //remove username and password and remember me from cookie
            removeCookie("username");
            removeCookie("password");
            removeCookie("remember_me");
          }

          yield put({
            type: appAction.SHOW_SIGHNIN,
            showLogin: false
          });
          yield put({
            type: appAction.SHOW_HELPUS,
            showHelpus: true
          });
          notification("success", "", "Successfully Logged in");
          // if (token.data[0].group_id === "4") {
          //   //yield put(push("/prive-user"));
          //   window.location.href = '/prive-user';
          // } else {
          //   window.location.href = '/';
          // }
        }
      } else {
        if (response.data.message) {
          notification("error", "", response.data.message);
        } else {
          notification("error", "", "Invalid Username or password.");
        }

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
      //   console.log(payload.payload.userInfo);
      //user details
      let firstname = payload.payload.userInfo.first_name;
      let lastname = payload.payload.userInfo.last_name;
      let type = payload.payload.userInfo.type;
      let email = payload.payload.userInfo.email;
      let password = payload.payload.userInfo.password;
      // let storeId = payload.payload.userInfo.storeId;
      let storeId = payload.payload.userInfo.storeId;
      // console.log(type);
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
            userInfo: {
              group_id: token.data[0].group_id
            }
          });
          notification("success", "", "Account registered and Successfully Logged in");

          let id_token = token.data[0].new_token;
          let data = {
            'cust_id': token.data[0].entity_id,
            'token_email': token.data[0].email,
            'token_name': token.data[0].firstname + ' ' + token.data[0].lastname,
            'token': token.data[0].group_id,
            'id_token': response.data
          }

          sessionService.saveSession({ id_token })
          sessionService.saveUser(data);

          yield setCookie("username", token.data[0].email);
          if (token.data[0].group_id === "4") {
            yield put(push("/prive-user"));
          } else {
            yield put(push("/"));
          }

        } else {
          yield put({ type: actions.REGISTER_ERROR });
          yield put({ type: appAction.OPEN_SIGN_UP, showSignUp: true });
        }

      } else {
        notification("error", "", "Invalid email or password.");
        yield put({ type: actions.REGISTER_ERROR });
        yield put({ type: appAction.OPEN_SIGN_UP, showSignUp: true });
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

import { all, takeEvery, put, fork, call } from "redux-saga/effects";
// import { push } from "react-router-redux";
import actions from "./actions";
import Login from "./Login";
const loginApi = new Login();

export function* loginRequest() {

  yield takeEvery("LOGIN_REQUEST", function* (payload: any) {
    try {
      // console.log(payload.payload.userInfo);
      //user details
      var type = payload.payload.userInfo.type;
      var email = payload.payload.userInfo.email;
      var password = payload.payload.userInfo.password;
      // var rememberMe = payload.payload.userInfo.rememberMe;
      //API call to login request
      const response = yield call(loginApi.login, email, password, type);
      if (response.data.userId != "") {
        yield put({
          type: actions.LOGIN_SUCCESS,
          payload: response.data,
          userInfo: payload.payload.userInfo,
          token: response.id,
          history: payload.payload.history
        });
      } else {
        // notification("error", "Invalid email or password.");
        yield put({ type: actions.LOGIN_ERROR });
      }
    } catch (e) {
      console.log(e.data);
      // notification("error", "Invalid email or password.");
      // yield put({ type: actions.LOGIN_ERROR });
    }
  });
}

export function* registerRequest() {
  yield takeEvery("REGISTER_REQUEST", function* (payload: any) {
    try {
      console.log(payload.payload.userInfo);
      //user details
      var type = payload.payload.userInfo.type;
      var email = payload.payload.userInfo.email;
      var password = payload.payload.userInfo.password;
      // var rememberMe = payload.payload.userInfo.rememberMe;
      //API call to login request
      const response = yield call(loginApi.login, email, password, type);
      if (response.data.userId != "") {
        yield put({
          type: actions.LOGIN_SUCCESS,
          payload: response.data,
          userInfo: payload.payload.userInfo,
          token: response.id,
          history: payload.payload.history
        });
      } else {
        // notification("error", "Invalid email or password.");
        yield put({ type: actions.LOGIN_ERROR });
      }
    } catch (e) {
      console.log(e.data);
      // notification("error", "Invalid email or password.");
      // yield put({ type: actions.LOGIN_ERROR });
    }
  });
}
export default function* rootSaga() {
  yield all([
    fork(loginRequest),
    fork(registerRequest)
  ]);
}

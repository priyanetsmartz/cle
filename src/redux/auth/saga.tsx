import { all, takeEvery, fork } from "redux-saga/effects";

export function* loginRequest() {
  yield takeEvery("LOGIN_REQUEST", function* (payload) {
    try {

    } catch (e) {
      //console.log(e.data);
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(loginRequest)
  ]);
}

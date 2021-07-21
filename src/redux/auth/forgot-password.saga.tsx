import { all, takeEvery, put, fork, call } from "redux-saga/effects";


export function* forgotPasswordRequest() {

  yield takeEvery("FORGOT_PASSWORD", function* (payload) {
    try {
      console.log('SAGA',payload);
      
    } catch (e) {
      console.log(e.data);
    }
  });
}

export function* resetPasswordRequest() {

  yield takeEvery("RESET_PASSWORD", function* (payload) {
    try {
      console.log('SAGA',payload);
      
    } catch (e) {
      console.log(e.data);
    }
  });
}


export default function* rootSaga() {
  yield all([
    fork(forgotPasswordRequest),
    fork(resetPasswordRequest)
  ]);
}

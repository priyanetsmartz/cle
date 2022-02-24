import { all, takeEvery, put, fork, call } from "redux-saga/effects";


export function* forgotPasswordRequest() {

  yield takeEvery("FORGOT_PASSWORD", function* (payload) {
    try {
    
    } catch (e) {

    }
  });
}

export function* resetPasswordRequest() {

  yield takeEvery("RESET_PASSWORD", function* (payload) {
    try {
 
      
    } catch (e) {
 
    }
  });
}


export default function* rootSaga() {
  yield all([
    fork(forgotPasswordRequest),
    fork(resetPasswordRequest)
  ]);
}

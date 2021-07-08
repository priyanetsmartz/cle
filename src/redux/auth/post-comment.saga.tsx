import { all, takeEvery, put, fork, call } from "redux-saga/effects";


export function* postCommentRequest() {

  yield takeEvery("POST_COMMENTS", function* (payload) {
    try {
      console.log('SAGA-POST',payload);
      
    } catch (e) {
      console.log(e.data);
    }
  });
}


export default function* rootSaga() {
  yield all([
    fork(postCommentRequest)
  ]);
}

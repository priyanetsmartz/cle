import { all, takeEvery, fork } from "redux-saga/effects";


export function* postCommentRequest() {

  yield takeEvery("POST_COMMENTS", function* (payload) {
    try {
   

    } catch (e) {
   
    }
  });
}


export default function* rootSaga() {
  yield all([
    fork(postCommentRequest)
  ]);
}

import { all } from "redux-saga/effects";
import authSagas from "./auth/saga";
import postCommentRequest from "./auth/post-comment.saga";

export default function* rootSaga(getState) {
    yield all([authSagas(), postCommentRequest()]);
}

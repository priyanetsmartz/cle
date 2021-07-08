import { all } from "redux-saga/effects";
import authSagas from "./auth/saga";
import forgotPassword from "./auth/forgot-password.saga";
import postCommentRequest from "./auth/post-comment.saga";

export default function* rootSaga(getState) {
    yield all([authSagas(), forgotPassword(), postCommentRequest()]);
}

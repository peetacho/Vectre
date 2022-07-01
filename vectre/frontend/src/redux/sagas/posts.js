import { call, put, takeLatest } from "redux-saga/effects"
import { getRequest, postRequest, putRequest } from "./index";
import {
    storePost,
    storeComments
} from "../actions/posts";
import {
    GET_POST,
    GET_COMMENTS,
    POST_COMMENT,
    POST_LIKE,
    POST_UNLIKE
} from "../constants/posts";
import {
    BASE_API_URL,
    POSTS
} from "../constants/endpoints";
import {showToast} from "../actions/toast";
import {TOAST_STATUSES} from "../constants/toast";

function* getPost(action) {
    try {
        const response = yield call(getRequest, BASE_API_URL + POSTS.GET_POST.replace("{postID}", action.postID)), responseData = response[1]
        if (responseData.success) {
            yield put(storePost(responseData.post))
        } else {
            yield put(showToast(TOAST_STATUSES.ERROR, responseData.message))
        }
    } catch (error) {
        yield put(showToast(TOAST_STATUSES.ERROR, "Failed to get post"))
        console.log(error)
    }
}

function* getComments(action) {
    try {
        const response = yield call(getRequest, BASE_API_URL + POSTS.GET_COMMENTS.replace("{postID}", action.postID)), responseData = response[1]
        if (responseData.success) {
            yield put(storeComments(responseData.comments))
        } else {
            yield put(showToast(TOAST_STATUSES.ERROR, responseData.message))
        }
    } catch (error) {
        yield put(showToast(TOAST_STATUSES.ERROR, "Failed to get comments"))
        console.log(error)
    }
}

function* postComment(action) {
    try {
        const response = yield call(postRequest, BASE_API_URL + POSTS.POST_COMMENT.replace("{postID}", action.postID), action.comment), responseData = response[1]
        if (responseData.success) {
            yield getPost({ postID: action.postID });
            yield getComments({ postID: action.postID });
            action.reloadForm();
        } else {
            yield put(showToast(TOAST_STATUSES.ERROR, responseData.message))
        }
    } catch (error) {
        yield put(showToast(TOAST_STATUSES.ERROR, "Failed to comment"))
        console.log(error)
    }
}

function* postLike(action) {
    try {
        const response = yield call(postRequest, BASE_API_URL + POSTS.POST_LIKE.replace("{postID}", action.postID), action.walletAddress), responseData = response[1]
        if (responseData.success) {
            action.reloadComponent();
        } else {
            yield put(showToast(TOAST_STATUSES.ERROR, responseData.message))
        }
    } catch (error) {
        yield put(showToast(TOAST_STATUSES.ERROR, "Failed to like"))
        console.log(error)
    }
}

function* postUnlike(action) {
    try {
        const response = yield call(postRequest, BASE_API_URL + POSTS.POST_UNLIKE.replace("{postID}", action.postID), action.walletAddress), responseData = response[1]
        if (responseData.success) {
            action.reloadComponent();
        } else {
            yield put(showToast(TOAST_STATUSES.ERROR, responseData.message))
        }
    } catch (error) {
        yield put(showToast(TOAST_STATUSES.ERROR, "Failed to unlike"))
        console.log(error)
    }
}

function* postsSaga() {
    yield takeLatest(GET_POST, getPost)
    yield takeLatest(GET_COMMENTS, getComments)
    yield takeLatest(POST_COMMENT, postComment)
    yield takeLatest(POST_LIKE, postLike)
    yield takeLatest(POST_UNLIKE, postUnlike)
}

export default postsSaga

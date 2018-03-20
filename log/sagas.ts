import { fork, takeEvery, all, put } from 'redux-saga/effects';
import { Action } from '../common';
import { ActionType, actionLogged } from './actions';

function* handleAction(action: Action) {
    if (action.type === ActionType.ACTION_LOGGED) {
        return;
    }

    const timestamp = Date.now();
    yield put(actionLogged(action, timestamp));
}

function* watchAllActions() {
    yield takeEvery('*', handleAction);
}

export function* rootSaga() {
    yield all([
        fork(watchAllActions)
    ]);
}
import { all, fork } from 'redux-saga/effects';
import { rootSaga as toolsRootSaga, ActionType } from '../tools';
import { rootSaga as logRootSaga } from '../log';

export function* saga() {
    yield all([
        fork(toolsRootSaga),
        fork(logRootSaga)
    ]);
}
import {
    select,
    call,
    put,
    all,
    fork,
    takeLatest,
    takeEvery,
    SelectEffect,
    CallEffect,
    PutEffect,
} from 'redux-saga/effects';
import { State } from '../common';
import {
    AllToolsEvaluationRequested,
    toolEvaluationCompleted,
    Action,
    ActionType,
    toolEvaluationPending,
    KnobChanged,
    ToolCreationRequested,
    toolCreated,
    ToolEvaluationCompleted,
} from './actions';
import { Tool, ToolHash, ToolId, Type } from './types';
import Registry from './Registry';

const evaluateTool = function*(
    tool: Tool
): IterableIterator<SelectEffect | CallEffect | PutEffect<ToolEvaluationCompleted>> {
    const { id: toolId, name: toolName, inputs: toolInputHash, knobs: toolKnobHash } = tool;
    const { tools: { byId: toolsHash } }: State = yield select();
    const inputToolIds = Array.from(
        new Set(
            Object.keys(toolInputHash)
                .map(inputName => toolInputHash[inputName].toolIds)
                .reduce((acc, curr) => acc.concat(curr), [])
        )
    ).filter(inputToolId => toolsHash[inputToolId].state === 'PENDING');

    for (let i = 0; i < inputToolIds.length; i += 1) {
        const inputToolId = inputToolIds[i];
        const value = yield call(evaluateTool, toolsHash[inputToolId], toolId => toolsHash[toolId]);
        toolsHash[inputToolId].value = value;
    }

    const implementation = Registry.getToolImplementation(toolName);
    const value = yield call(implementation, toolInputHash, toolKnobHash, toolsHash);
    yield put(toolEvaluationCompleted(toolId, value));

    return value;
};

function* handleAllToolsEvaluationRequested(action: AllToolsEvaluationRequested) {
    const { tools: { byId: toolsHash } }: State = yield select();

    yield all(Object.keys(toolsHash).map(toolId => put(toolEvaluationPending(toolId))));

    const rootTools = Object.keys(toolsHash)
        .map(toolId => toolsHash[toolId])
        .filter(tool => tool.outputs == null || tool.outputs.length === 0);
    const rootToolEvaluationTasks = rootTools.map(tool => fork(evaluateTool, tool));

    yield all(rootToolEvaluationTasks);
}

function* watchAllToolsEvaluationRequested() {
    yield takeLatest(ActionType.ALL_TOOLS_EVALUATION_REQUESTED, handleAllToolsEvaluationRequested);
}

const getDescendants = (toolId: ToolId, getTool: (toolId: ToolId) => Tool): Tool[] => {
    const tool = getTool(toolId);

    if (!tool.outputs || tool.outputs.length === 0) {
        return [tool];
    }

    return Array.from(
        new Set(
            [tool].concat(
                tool.outputs
                    .map(outputToolId => getDescendants(outputToolId, getTool))
                    .reduce((acc, curr) => acc.concat(curr), [])
            )
        )
    );
};

function* handleKnobChanged({ toolId, knobName, knobValue }: KnobChanged) {
    const { tools: { byId: toolsHash } }: State = yield select();
    const descendants = getDescendants(toolId, toolId => toolsHash[toolId]);
    yield all(descendants.map(({ id }) => put(toolEvaluationPending(id))));
    const rootDescendants = descendants.filter(
        ({ outputs }) => outputs == null || outputs.length === 0
    );
    yield all(rootDescendants.map(tool => fork(evaluateTool, tool)));
}

function* watchKnobChanged() {
    yield takeEvery(ActionType.KNOB_CHANGED, handleKnobChanged);
}

function* handleToolCreationRequested(action: ToolCreationRequested) {
    const { toolName } = action;

    const tool = Registry.createToolInstance(toolName);
    yield put(toolCreated(tool));
}

function* watchToolCreationRequested() {
    yield takeEvery(ActionType.TOOL_CREATION_REQUESTED, handleToolCreationRequested);
}

export function* rootSaga() {
    yield all([
        fork(watchAllToolsEvaluationRequested),
        fork(watchKnobChanged),
        fork(watchToolCreationRequested),
    ]);
}

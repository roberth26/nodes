import { select, call, put, all, fork, takeLatest, takeEvery } from 'redux-saga/effects';
import { State } from '../common';
import {
    AllToolsEvaluationRequested,
    toolEvaluationCompleted,
    Action,
    ActionType,
    toolEvaluationPending,
    KnobChanged,
    ToolCreationRequested,
    toolCreated
} from './actions';
import { Tool, ToolMap } from './types';
import Registry from './Registry';

const getRoots = (tool: Tool, toolMap: ToolMap): Tool[] => {
    if (!tool.outputs || tool.outputs.length === 0) {
        return [tool];
    }

    return [].concat(...tool.outputs.map(outputToolId => getRoots(toolMap[outputToolId], toolMap)));
};

function* evaluateTool(tool: Tool) {
    const {
        id: toolId,
        name: toolName,
        inputs: toolInputMap,
        knobs: toolKnobMap
    } = tool;

    const { tools }: State = yield select();
    const { byId } = tools;
    const inputToolEvaluationTaskMap = [].concat(...Object.keys(toolInputMap)
        .map(inputName => toolInputMap[inputName].toolIds))
        .reduce((map, inputToolId) => ({
            ...map,
            [inputToolId]: call(evaluateTool, tools.byId[inputToolId])
        }), {});
 
    yield all(inputToolEvaluationTaskMap);

    const implementation = Registry.getToolImplementation(toolName);

    const value = yield call(
        implementation,
        toolInputMap,
        toolKnobMap,
        byId
    );

    yield put(toolEvaluationCompleted(toolId, value));

    return value;
}

function* handleAllToolsEvaluationRequested(action: AllToolsEvaluationRequested) {
    const { tools }: State = yield select();

    const rootTools = [].concat(...Object.keys(tools.byId)
        .map(toolId => getRoots(tools.byId[toolId], tools.byId)));
    const rootToolsSet = new Set(rootTools);
    const rootToolsArray = Array.from(rootToolsSet);
    const rootToolEvaluationTasks = rootToolsArray.map(tool => fork(evaluateTool, tool))

    yield all(rootToolEvaluationTasks);
}

function* watchAllToolsEvaluationRequested() {
    yield takeLatest(ActionType.ALL_TOOLS_EVALUATION_REQUESTED, handleAllToolsEvaluationRequested);
}

function* handleKnobChanged({ toolId, knobName, knobValue }: KnobChanged) {
    const { tools }: State = yield select();
    yield put(toolEvaluationPending(toolId));
    yield call(evaluateTool, tools.byId[toolId]);
}

function* watchKnobChanged() {
    yield takeEvery(ActionType.KNOB_CHANGED, handleKnobChanged);
}

function* handleToolCreationRequested(action: ToolCreationRequested) {
    const { toolName } = action;

    const tool = Registry.createToolInstance(toolName);
    yield put(toolCreated(tool));
};

function* watchToolCreationRequested() {
    yield takeEvery(ActionType.TOOL_CREATION_REQUESTED, handleToolCreationRequested);
}

export function* rootSaga() {
    yield all([
        fork(watchAllToolsEvaluationRequested),
        fork(watchKnobChanged),
        fork(watchToolCreationRequested)
    ]);
}
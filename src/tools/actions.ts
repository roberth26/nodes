import { ToolId, ToolValue, ToolPosition, Type, Tool } from './types';

export type Action =
    AllToolsEvaluationRequested |
    ToolEvaluationCompleted |
    ToolEvaluationPending |
    ToolMoved |
    ToolSelected |
    ToolLabelChanged |
    KnobChanged |
    ToolCreationRequested |
    ToolCreated |
    ToolInputConnectRequested |
    ToolInputConnectSucceeded |
    ToolInputConnectFailed |
    ToolOutputConnectRequested |
    ToolOutputConnectSucceeded |
    ToolOutputConnectFailed;

export enum ActionType {
    ALL_TOOLS_EVALUATION_REQUESTED = 'ALL_TOOLS_EVALUATION_REQUESTED',
    TOOL_EVALUATION_COMPLETED = 'TOOL_EVALUATION_COMPLETED',
    TOOL_EVALUATION_PENDING = 'TOOL_EVALUATION_PENDING',
    TOOL_MOVED = 'TOOL_MOVED',
    TOOL_SELECTED = 'TOOL_SELECTED',
    TOOL_LABEL_CHANGED = 'TOOL_LABEL_CHANGED',
    KNOB_CHANGED = 'KNOB_CHANGED',
    TOOL_CREATION_REQUESTED = 'TOOL_CREATION_REQUESTED',
    TOOL_CREATED = 'TOOL_CREATED',
    TOOL_INPUT_CONNECT_REQUESTED = 'TOOL_INPUT_CONNECT_REQUESTED',
    TOOL_INPUT_CONNECT_SUCCEEDED = 'TOOL_INPUT_CONNECT_SUCCEEDED',
    TOOL_INPUT_CONNECT_FAILED = 'TOOL_INPUT_CONNECT_FAILED',
    TOOL_OUTPUT_CONNECT_REQUESTED = 'TOOL_OUTPUT_CONNECT_REQUESTED',
    TOOL_OUTPUT_CONNECT_SUCCEEDED = 'TOOL_OUTPUT_CONNECT_SUCCEEDED',
    TOOL_OUTPUT_CONNECT_FAILED = 'TOOL_OUTPUT_CONNECT_FAILED'
}

export type AllToolsEvaluationRequested = {
    type: ActionType.ALL_TOOLS_EVALUATION_REQUESTED
};
export type ToolEvaluationCompleted = {
    type: ActionType.TOOL_EVALUATION_COMPLETED;
    toolId: ToolId;
    toolValue: ToolValue;
};
export type ToolEvaluationPending = {
    type: ActionType.TOOL_EVALUATION_PENDING;
    toolId: ToolId;
};
export type ToolMoved = {
    type: ActionType.TOOL_MOVED;
    toolId: ToolId;
    toolPosition: ToolPosition;
};
export type ToolSelected = {
    type: ActionType.TOOL_SELECTED;
    toolId: ToolId;
};
export type ToolLabelChanged = {
    type: ActionType.TOOL_LABEL_CHANGED;
    toolId: ToolId;
    label: string;
};
export type KnobChanged = {
    type: ActionType.KNOB_CHANGED;
    toolId: ToolId;
    knobName: string;
    knobValue: Type;
};
export type ToolCreationRequested = {
    type: ActionType.TOOL_CREATION_REQUESTED;
    toolName: string;
};
export type ToolCreated = {
    type: ActionType.TOOL_CREATED;
    tool: Tool;
};
export type ToolInputConnectRequested = {
    type: ActionType.TOOL_INPUT_CONNECT_REQUESTED;
    toolId: ToolId;
    inputName: string;
    upstreamToolId: ToolId;
};
export type ToolInputConnectSucceeded = {
    type: ActionType.TOOL_INPUT_CONNECT_SUCCEEDED;
    toolId: ToolId;
    inputName: string;
    upstreamToolId: ToolId;
};
export type ToolInputConnectFailed = {
    type: ActionType.TOOL_INPUT_CONNECT_FAILED;
    toolId: ToolId;
    inputName: string;
    upstreamToolId: ToolId;
    error: string;
};
export type ToolOutputConnectRequested = {
    type: ActionType.TOOL_OUTPUT_CONNECT_REQUESTED;
    toolId: ToolId;
    downstreamToolId: ToolId;
    downstreamInputName: string;
};
export type ToolOutputConnectSucceeded = {
    type: ActionType.TOOL_OUTPUT_CONNECT_SUCCEEDED;
    toolId: ToolId;
    downstreamToolId: ToolId;
    downstreamInputName: string;
};
export type ToolOutputConnectFailed = {
    type: ActionType.TOOL_OUTPUT_CONNECT_FAILED;
    toolId: ToolId;
    downstreamToolId: ToolId;
    downstreamInputName: string;
    error: string;
};

export const allToolsEvaluationRequested = (): AllToolsEvaluationRequested => ({
    type: ActionType.ALL_TOOLS_EVALUATION_REQUESTED
});
export const toolEvaluationCompleted = (toolId: ToolId, toolValue: ToolValue): ToolEvaluationCompleted => ({
    toolId,
    toolValue,
    type: ActionType.TOOL_EVALUATION_COMPLETED
});
export const toolEvaluationPending = (toolId: ToolId): ToolEvaluationPending => ({
    toolId,
    type: ActionType.TOOL_EVALUATION_PENDING
});
export const toolMoved = (toolId: ToolId, toolPosition: ToolPosition): ToolMoved => ({
    toolId,
    toolPosition,
    type: ActionType.TOOL_MOVED
});
export const toolSelected = (toolId: ToolId): ToolSelected => ({
    toolId,
    type: ActionType.TOOL_SELECTED
});
export const toolLabelChanged = (toolId: ToolId, label: string): ToolLabelChanged => ({
    toolId,
    label,
    type: ActionType.TOOL_LABEL_CHANGED
});
export const knobChanged = (toolId: ToolId, knobName: string, knobValue: Type): KnobChanged => ({
    toolId,
    knobName,
    knobValue,
    type: ActionType.KNOB_CHANGED
});
export const toolCreationRequested = (toolName: string): ToolCreationRequested => ({
    toolName,
    type: ActionType.TOOL_CREATION_REQUESTED
});
export const toolCreated = (tool: Tool): ToolCreated => ({
    tool,
    type: ActionType.TOOL_CREATED
});
export const toolInputConnectRequested = (
    toolId: ToolId,
    inputName: string,
    upstreamToolId: ToolId
): ToolInputConnectRequested => ({
    toolId,
    inputName,
    upstreamToolId,
    type: ActionType.TOOL_INPUT_CONNECT_REQUESTED
});
export const toolInputConnectSucceeded = (
    toolId: ToolId,
    inputName: string,
    upstreamToolId: ToolId
): ToolInputConnectSucceeded => ({
    toolId,
    inputName,
    upstreamToolId,
    type: ActionType.TOOL_INPUT_CONNECT_SUCCEEDED
});
export const toolInputConnectFailed = (
    toolId: ToolId,
    inputName: string,
    upstreamToolId: ToolId,
    error: string
): ToolInputConnectFailed => ({
    toolId,
    inputName,
    upstreamToolId,
    error,
    type: ActionType.TOOL_INPUT_CONNECT_FAILED
});
export const toolOutputConnectRequested = (
    toolId: ToolId,
    downstreamToolId: ToolId,
    downstreamInputName: string
): ToolOutputConnectRequested => ({
    toolId,
    downstreamToolId,
    downstreamInputName,
    type: ActionType.TOOL_OUTPUT_CONNECT_REQUESTED
});
export const toolOutputConnectSucceeded = (
    toolId: ToolId,
    downstreamToolId: ToolId,
    downstreamInputName: string
): ToolOutputConnectSucceeded => ({
    toolId,
    downstreamToolId,
    downstreamInputName,
    type: ActionType.TOOL_OUTPUT_CONNECT_SUCCEEDED
});
export const toolOutputConnectFailed = (
    toolId: ToolId,
    downstreamToolId: ToolId,
    downstreamInputName: string,
    error: string
): ToolOutputConnectFailed => ({
    toolId,
    downstreamToolId,
    downstreamInputName,
    error,
    type: ActionType.TOOL_OUTPUT_CONNECT_FAILED
});
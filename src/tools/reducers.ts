import { initialState } from './constants';
import { Action, ActionType } from './actions';
import { ToolId, Tool, State, Knob } from './types';

export const reducer = (state = initialState, action: Action): State => {
    switch (action.type) {
        case ActionType.ALL_TOOLS_EVALUATION_REQUESTED: {
            return {
                ...state,
                byId: Object.keys(state.byId)
                    .map<[ToolId, Tool]>(toolId => [toolId, state.byId[toolId]])
                    .reduce((toolMap, [currToolId, currTool]) => {
                        toolMap[currToolId] = {
                            ...currTool,
                            state: 'EVALUATING',
                        };

                        return toolMap;
                    }, {}),
            };
        }

        case ActionType.TOOL_EVALUATION_COMPLETED: {
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.toolId]: {
                        ...state.byId[action.toolId],
                        value: action.toolValue,
                        state: 'EVALUATED',
                    },
                },
            };
        }

        case ActionType.TOOL_EVALUATION_PENDING: {
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.toolId]: {
                        ...state.byId[action.toolId],
                        state: 'PENDING',
                    },
                },
            };
        }

        case ActionType.TOOL_SELECTED: {
            return {
                ...state,
                activeToolId: action.toolId,
            };
        }

        case ActionType.TOOL_MOVED: {
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.toolId]: {
                        ...state.byId[action.toolId],
                        position: action.toolPosition,
                    },
                },
            };
        }

        case ActionType.TOOL_LABEL_CHANGED: {
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.toolId]: {
                        ...state.byId[action.toolId],
                        label: action.label,
                    },
                },
            };
        }

        case ActionType.KNOB_CHANGED: {
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.toolId]: {
                        ...state.byId[action.toolId],
                        state: 'PENDING',
                        knobs: {
                            ...state.byId[action.toolId].knobs,
                            [action.knobName]: {
                                ...state.byId[action.toolId].knobs[action.knobName],
                                value: action.knobValue,
                            } as Knob,
                        },
                    },
                },
            };
        }

        case ActionType.TOOL_CREATED: {
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.tool.id]: action.tool,
                },
            };
        }

        case ActionType.TOOL_INPUT_CONNECT_SUCCEEDED: {
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.toolId]: {
                        ...state.byId[action.toolId],
                        inputs: {
                            ...state.byId[action.toolId].inputs,
                            [action.inputName]: {
                                ...state.byId[action.toolId].inputs[action.inputName],
                                toolIds: [
                                    ...state.byId[action.toolId].inputs[action.inputName].toolIds,
                                    action.upstreamToolId,
                                ],
                            },
                        },
                    },
                    [action.upstreamToolId]: {
                        ...state.byId[action.upstreamToolId],
                        outputs: Array.from(new Set([...state.byId[action.upstreamToolId].outputs, action.toolId])),
                    },
                },
            };
        }

        case ActionType.TOOL_OUTPUT_CONNECT_SUCCEEDED: {
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.downstreamToolId]: {
                        ...state.byId[action.downstreamToolId],
                        inputs: {
                            ...state.byId[action.downstreamToolId].inputs,
                            [action.downstreamInputName]: {
                                ...state.byId[action.downstreamToolId].inputs[action.downstreamInputName],
                                toolIds: [
                                    ...state.byId[action.downstreamToolId].inputs[action.downstreamInputName].toolIds,
                                    action.toolId,
                                ],
                            },
                        },
                    },
                    [action.toolId]: {
                        ...state.byId[action.toolId],
                        outputs: [
                            ...Array.from(new Set([...state.byId[action.toolId].outputs, action.downstreamToolId])),
                        ],
                    },
                },
            };
        }

        default:
            return state;
    }
};

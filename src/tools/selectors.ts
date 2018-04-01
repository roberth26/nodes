import { Tool, State, Knob } from './types';

export const getToolsAsArray = (state: State): Tool[] => {
    return Object.keys(state.byId)
        .map(toolId => state.byId[toolId]);
};

export const getActiveToolKnobs = (state: State): Knob[] => {
    const { activeToolId, byId } = state;
    const activeTool = byId[activeToolId];

    if (activeTool == null) {
        return [];
    }

    const activeToolKnobs = Object.keys(activeTool.knobs)
        .map(knobName => activeTool.knobs[knobName]);

    return activeToolKnobs;
};
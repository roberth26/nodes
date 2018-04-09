import { ToolImplementation, Knob, ToolFactory } from '../types';
import Registry from '../Registry';

const name = 'DEFER';

const factory: ToolFactory = () => ({
    name,
    outputType: 'NUMBER',
    inputs: {
        input: {
            name: 'input',
            toolIds: [],
            variadic: false,
            type: 'NUMBER',
        },
    },
    knobs: {
        timeout: {
            value: 300,
            name: 'timeout',
            type: 'NUMBER',
        },
    },
});

const implementation: ToolImplementation = (inputs, knobs, toolMap) => {
    const { input } = inputs;
    const { toolIds } = input;
    const value = toolIds.map(toolId => toolMap[toolId])[0].value as number;
    const { timeout: { value: timeoutDuration } } = knobs;

    return new Promise(r => {
        setTimeout(() => r(value), timeoutDuration);
    });
};

Registry.register(name, factory, implementation);

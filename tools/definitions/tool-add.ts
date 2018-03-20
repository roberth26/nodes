import { ToolImplementation, Knob, ToolFactory } from '../types';
import Registry from '../Registry';

const name = 'ADD';

const factory: ToolFactory = () => ({
    name,
    outputType: 'NUMBER',
    inputs: {
        operand: {
            name: 'operand', 
            toolIds: [],
            variadic: true,
            type: 'NUMBER'
        }
    }
});

const implementation: ToolImplementation = (inputs, knobs, toolMap) => {
    const { operand: operandInput } = inputs;
    const { toolIds } = operandInput;
    const inputTools = toolIds.map(toolId => toolMap[toolId]);
    const inputToolValues = inputTools.map(({ value }) => value as number);

    return new Promise(r => {
        setTimeout(() => r(inputToolValues.reduce((total, curr) => total + curr, 0)), 2500);
    });
};

Registry.register(name, factory, implementation);
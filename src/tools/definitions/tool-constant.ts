import { ToolImplementation, Knob, ToolFactory } from '../types';
import Registry from '../Registry';

const name = 'CONSTANT';

const factory: ToolFactory = () => ({
    name,
    outputType: 'NUMBER',
    knobs: {
        value: {
            value: 50,
            name: 'value',
            type: 'NUMBER',
        },
    },
});

const implementation: ToolImplementation = (inputs, knobs, toolMap) => {
    const { value: valueKnob } = knobs;
    const { value } = valueKnob;

    return value;
};

Registry.register(name, factory, implementation);

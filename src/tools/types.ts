import { Id } from '../common';

export type TypeString = 'NUMBER' | 'BOOLEAN' | 'STRING';
export type Type = number | boolean | string;

type NumberKnob = {
    type: 'NUMBER';
    value: number;
};

type BooleanKnob = {
    type: 'BOOLEAN';
    value: boolean;
};

type StringKnob = {
    type: 'STRING';
    value: string;
};

type TypedKnob = NumberKnob | BooleanKnob | StringKnob;

export type Knob = TypedKnob & {
    name: string;
};

export type KnobMap = {
    [knobName: string]: Knob;
};

export type ToolId = Id;
export type ToolPosition = {
    x: number;
    y: number;
};
export type ToolValue = Type;
export type ToolState = 'PENDING' | 'EVALUATING' | 'EVALUATED';
export type InputGroup = {
    name: string;
    toolIds: ToolId[];
    variadic: boolean;
    type: TypeString;
};
export type InputMap = {
    [inputGroupName: string]: InputGroup
};

export type Tool = {
    id: ToolId;
    name: string;
    label: string;
    state: ToolState;
    inputs: InputMap;
    knobs: KnobMap;
    outputs: ToolId[];
    position: ToolPosition;
    value: ToolValue;
    outputType: TypeString;
};

export type ToolMap = {
    [toolId: string]: Tool;
};

export type State = {
    activeToolId: ToolId;
    byId: ToolMap;
};

export type ToolImplementation = (inputs?: InputMap, knobs?: KnobMap, toolMap?: ToolMap) => Type | Promise<Type>;

export type ToolFactory = () => Partial<Tool> & {
    name: string;
    outputType: TypeString;
};
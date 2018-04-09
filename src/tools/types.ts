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

export type KnobHash = {
    [knobName: string]: Knob;
};

export type ToolId = Id;
export type ToolPosition = {
    x: number;
    y: number;
};
export type ToolValue = Type;
export type ToolEvaluationState = 'PENDING' | 'EVALUATING' | 'EVALUATED';
export type InputGroup = {
    name: string;
    toolIds: ToolId[];
    variadic: boolean;
    type: TypeString;
};
export type InputHash = {
    [inputGroupName: string]: InputGroup;
};

export type Tool = {
    id: ToolId;
    name: string;
    label: string;
    state: ToolEvaluationState;
    inputs: InputHash;
    knobs: KnobHash;
    outputs: ToolId[];
    position: ToolPosition;
    value: ToolValue;
    outputType: TypeString;
};

export type ToolHash = {
    [toolId: string]: Tool;
};

export type State = {
    activeToolId: ToolId;
    byId: ToolHash;
};

export type ToolImplementation = (
    inputs?: InputHash,
    knobs?: KnobHash,
    toolMap?: ToolHash
) => Type | Promise<Type>;

export type ToolFactory = () => Partial<Tool> & {
    name: string;
    outputType: TypeString;
};

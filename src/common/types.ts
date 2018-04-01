import { State as ToolState } from '../tools';
import { State as LogState } from '../log';

export type Id = string;

export type State = {
    tools: ToolState;
    log: LogState;
};
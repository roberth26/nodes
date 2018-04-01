import { initialState as initialToolsState } from '../tools';
import { initialState as initialLogState } from '../log';
import { State } from './types';

export const initialState: State = {
    tools: initialToolsState,
    log: initialLogState
};
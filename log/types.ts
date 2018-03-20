import { Action } from '../common';

type LogItem = Action & {
    timestamp: number; // ms since epoch
};

export type State = LogItem[];
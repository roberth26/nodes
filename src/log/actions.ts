import { Action as GenericAction } from '../common';

export type Action = ActionLogged;

export enum ActionType {
    ACTION_LOGGED = 'ACTION_LOGGED'
}

export type ActionLogged = {
    type: ActionType.ACTION_LOGGED;
    action: GenericAction;
    timestamp: number;
};

export const actionLogged = (action: GenericAction, timestamp: number): ActionLogged => ({
    action,
    timestamp,
    type: ActionType.ACTION_LOGGED
});
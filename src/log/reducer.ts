import { initialState } from './constants';
import { State } from './types';
import { Action, ActionType } from './actions';

export const reducer = (state = initialState, action: Action): State => {
    switch (action.type) {
        case ActionType.ACTION_LOGGED:
            return [
                ...state,
                {
                    ...action.action,
                    timestamp: action.timestamp
                }
            ];
        default:
            return state;
    }
};
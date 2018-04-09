import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createMiddleware from 'redux-saga';
import { injectGlobal } from 'styled-components';
import { saga as rootSaga, State } from './common';
import { reducer as toolsReducer, Registry } from './tools';
import { reducer as logReducer } from './log';
import Nodes from './common/containers/Nodes';

injectGlobal`
    *, *:before, *:after {
        box-sizing: border-box;
    }

    html {
        font-size: 62.5%; // 10px
        font-family: 'Lato';
    }
    
    body {
        font-size: 1.6rem;
        font-weight: normal;
        line-height: 1;
        color: black;
        margin: 0;
        padding: 0;
    }
`;

const initialState: State = {
    log: [],
    tools: {
        activeToolId: null,
        byId: {
            a: {
                id: 'a',
                name: 'CONSTANT',
                label: 'constant 1',
                state: 'PENDING',
                inputs: {},
                outputs: ['c'],
                knobs: {
                    value: {
                        name: 'value',
                        type: 'NUMBER',
                        value: 5,
                    },
                },
                position: {
                    x: 50,
                    y: 50,
                },
                value: null,
                outputType: 'NUMBER',
            },
            b: {
                id: 'b',
                name: 'CONSTANT',
                label: 'constant 2',
                state: 'PENDING',
                inputs: {},
                outputs: ['c'],
                knobs: {
                    value: {
                        name: 'value',
                        type: 'NUMBER',
                        value: 10,
                    },
                },
                position: {
                    x: 50,
                    y: 250,
                },
                value: null,
                outputType: 'NUMBER',
            },
            c: {
                id: 'c',
                name: 'ADD',
                label: 'add 1',
                state: 'PENDING',
                inputs: {
                    operand: {
                        name: 'operand',
                        toolIds: ['a', 'b'],
                        type: 'NUMBER',
                        variadic: true,
                    },
                },
                outputs: ['f'],
                knobs: {},
                position: {
                    x: 400,
                    y: 120,
                },
                value: null,
                outputType: 'NUMBER',
            },
            d: {
                id: 'd',
                name: 'CONSTANT',
                label: 'constant 3',
                state: 'PENDING',
                inputs: {},
                outputs: ['f'],
                knobs: {
                    value: {
                        name: 'value',
                        type: 'NUMBER',
                        value: 8,
                    },
                },
                position: {
                    x: 400,
                    y: 50,
                },
                value: null,
                outputType: 'NUMBER',
            },
            e: {
                id: 'e',
                name: 'CONSTANT',
                label: 'constant 4',
                state: 'PENDING',
                inputs: {},
                outputs: ['f', 'f'],
                knobs: {
                    value: {
                        name: 'value',
                        type: 'NUMBER',
                        value: 20,
                    },
                },
                position: {
                    x: 400,
                    y: 250,
                },
                value: null,
                outputType: 'NUMBER',
            },
            f: {
                id: 'f',
                name: 'ADD',
                label: 'add 2',
                state: 'PENDING',
                inputs: {
                    operand: {
                        name: 'operand',
                        type: 'NUMBER',
                        toolIds: ['d', 'c', 'e', 'e'],
                        variadic: true,
                    },
                },
                outputs: [],
                knobs: {},
                position: {
                    x: 750,
                    y: 100,
                },
                value: null,
                outputType: 'NUMBER',
            },
        },
    },
};

const sagaMiddleware = createMiddleware();

const composeEnhancers =
    process.env.NODE_ENV !== 'production' && window['__REDUX_DEVTOOLS_EXTENSION__'] != null
        ? window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']
        : compose;

const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));

const rootReducer = combineReducers({
    tools: toolsReducer,
    log: logReducer,
});

const store = createStore(rootReducer, initialState, enhancer);

sagaMiddleware.run(rootSaga);

const rootElement = document.getElementById('root');
const rootComponent = (
    <Provider store={store}>
        <Nodes />
    </Provider>
);

ReactDOM.render(rootComponent, rootElement);

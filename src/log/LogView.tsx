import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import JSONTree from 'react-json-tree';
import { Action, State } from '../common';

type LogViewProps = {
    actions?: Action[]; // injected
};

const LogItem = styled.div`
    color: white;
    font-family: monospace;
    border-bottom: 1px solid rgba(255, 255, 255, .4);
    line-height: 1.5;
    padding-left: 10px;
`;

const JSONTreeViewTheme = {
    scheme: 'monokai',
    author: 'wimer hazenberg (http://www.monokai.nl)',
    base00: '#252e35',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633'
};

const LogView: React.SFC<LogViewProps> = ({ actions }) => (
    <div style={{
        width: '100%',
        overflow: 'auto'
    }}>
        {actions.map(({ timestamp, type, ...action}, index) => {
            const date = new Date(timestamp);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            const ms = date.getMilliseconds();

            return (
                <LogItem key={index}>
                    <JSONTree
                        hideRoot={true}
                        theme={JSONTreeViewTheme}
                        invertTheme={false}
                        data={{
                            [`${type} [${hours}:${minutes}:${seconds}:${ms}]`]: {
                                ...action
                            }
                        }}
                    />
                </LogItem>
            );
        })}
    </div>
);

const mapStateToProps = (state: State, ownProps: LogViewProps): Partial<LogViewProps> => ({
    actions: state.log
});

const mapDispatchToProps = (dispatch): Partial<LogViewProps> => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogView);
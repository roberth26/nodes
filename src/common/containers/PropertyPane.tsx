import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { State } from '../types';
import {
    Tool,
    ToolId,
    toolLabelChanged,
    Knob,
    Type,
    knobChanged,
    getActiveToolKnobs,
    allToolsEvaluationRequested,
    Registry,
    toolCreationRequested
} from '../../tools';

type PropertyPaneProps = React.HTMLAttributes<HTMLElement> & {
    activeTool: Tool;
    onToolLabelChange: (toolId: ToolId, name: string) => void;
    onEvaluateAllToolsRequest: () => void;
    knobs: Knob[];
    onKnobChange: (
        toolId: ToolId,
        knobName: string,
        knobValue: Type
    ) => void;
    onToolCreate: (toolName: string) => void;
};

const ToolName = styled.input`
    background-color: transparent;
    border: 0;
    border-radius: 0;
    margin: 0;
    color: white;
    height: 30px;
    display: block;
    width: 100%;
    font-size: 16px;
    padding: 15px;
`;

const KnobWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 0 15px;
    color: white;
`;

class PropertyPane extends React.Component<PropertyPaneProps> {
    handleToolLabelChange = event => {
        const { onToolLabelChange, activeTool } = this.props;

        const element = event.target as HTMLInputElement;
        const name = element.value;

        if (onToolLabelChange) {
            onToolLabelChange(activeTool.id, name);
        }
    };

    createHandleKnobChange = (knob: Knob) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activeTool, onKnobChange } = this.props;

        const inputElement = event.target as HTMLInputElement;
        let value: Type = inputElement.value;

        switch (knob.type) {
            case 'NUMBER':
                value = Number(value);
        }

        if (onKnobChange) {
            onKnobChange(activeTool.id, knob.name, value);
        }
    };

    handleEvaluateAllToolsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { onEvaluateAllToolsRequest } = this.props;

        if (onEvaluateAllToolsRequest) {
            onEvaluateAllToolsRequest();
        }
    };

    handleCreateToolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { onToolCreate } = this.props;
        const selectElement = event.target as HTMLSelectElement;
        const { value: toolName } = selectElement;

        if (onToolCreate) {
            onToolCreate(toolName);
        }
    };

    render() {
        const{
            children,
            activeTool,
            onToolLabelChange,
            onKnobChange,
            onToolCreate,
            onEvaluateAllToolsRequest,
            knobs,
            ...props
        } = this.props;

        return (
            <aside {...props}>
                {activeTool != null && (
                    <ToolName
                        value={activeTool.label}
                        onChange={this.handleToolLabelChange}
                    />
                )}
                {knobs.map(knob => (
                    <KnobWrapper key={knob.name}>
                        <label htmlFor={knob.name}>
                            {knob.name}
                        </label>
                        {(() => {
                            switch (knob.type) {
                                case 'NUMBER':
                                    return (
                                        <input
                                            type="number"
                                            value={knob.value}
                                            id={knob.name}
                                            onChange={this.createHandleKnobChange(knob)}
                                        />
                                    );
                                default:
                                    return null;
                            }
                        })()}
                    </KnobWrapper>
                ))}
                <button onClick={this.handleEvaluateAllToolsClick}>Evaluate All</button>
                <select
                    onChange={this.handleCreateToolChange}
                    value={''}
                >
                    <option
                        value={''}
                        children={'Create Tool'}
                    />
                    {Registry.getToolNames().map(toolName => (
                        <option
                            key={toolName}
                            value={toolName}
                            children={toolName}
                        />
                    ))}
                </select>
            </aside>
        );
    }
}

const mapStateToProps = (state: State): Partial<PropertyPaneProps> => {
    const activeTool = state.tools.byId[state.tools.activeToolId];

    return {
        activeTool,
        knobs: getActiveToolKnobs(state.tools)
    };
};

const mapDispatchToProps = (dispatch): Partial<PropertyPaneProps> => ({
    onToolLabelChange: (toolId: ToolId, toolName: string) => dispatch(toolLabelChanged(toolId, toolName)),
    onKnobChange: (
        toolId: ToolId,
        knobName: string,
        knobValue: Type
    ) => dispatch(knobChanged(toolId, knobName, knobValue)),
    onEvaluateAllToolsRequest: () => dispatch(allToolsEvaluationRequested()),
    onToolCreate: (toolName: string) => dispatch(toolCreationRequested(toolName))
});

const PropertyPaneContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PropertyPane);

export default styled(PropertyPaneContainer)`
    z-index: 10;
    background-color: #252e35;
`;
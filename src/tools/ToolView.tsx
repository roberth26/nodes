import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { Tool, ToolState } from './types';

type ToolViewProps = {
    tool: Tool;
    innerRef: (element: HTMLElement) => void;
    onDrag: (event: React.DragEvent<HTMLElement>) => void;
    active: boolean;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

type WrapperProps = React.HTMLAttributes<HTMLElement> & {
    active: boolean;
    state: ToolState;
    customInnerRef: React.Ref<HTMLElement>;
};

const Wrapper: React.SFC<WrapperProps> = ({ active, customInnerRef, ...props }) => (
    <section
        ref={customInnerRef}
        {...props}
    />
);

const evaluationStrobing = keyframes`
    from {
        background-color: yellow;
    }
    to {
        background-color: orange;
    }
`;

const StyledWrapper = styled(Wrapper)`
    position: absolute;
    z-index: 10;
    width: 240px;
    border-radius: 3px;
    border: 1px solid ${props => props.active ? 'red' : '#87b9f5'};

    background-color: ${({ state }) => state === 'EVALUATED'
        ? 'green'
        : 'red'
    };

    ${props => props.state === 'EVALUATING'
        ? `animation: ${evaluationStrobing} .5s ease infinite`
        : ''
    };
`;

const Header = styled.header`
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    background-color: rgba(255, 255, 255, .25);
    text-align: center;
    height: 30px;
`;

const Input = styled.div`
    display: flex;
    align-items: center;
    height: 24px;
    color: white;
    font-size: 1.2rem;
    font-family: monospace;
`;

const InputType = styled.span`
    opacity: .7;
`;

const InputTarget = styled.div`
    width: 16px;
    height: 16px;
    border-radius: 20px;
    background-color: orange;
    margin-left: -8px;
    margin-right: 8px;
`;

const ToolView: React.SFC<ToolViewProps> = ({
    tool,
    innerRef,
    onDrag,
    active,
    onClick
}) => (
    <StyledWrapper
        customInnerRef={innerRef}
        onDragEnd={onDrag}
        draggable={true}
        active={active}
        onClick={onClick}
        state={tool.state}
        style={{
            left: tool.position.x,
            top: tool.position.y
        }}
    >
        <Header>
            <span>{tool.label}</span>
            {tool.value != null && <span>&nbsp;[{tool.value}]</span>}
        </Header>
        {Object.keys(tool.inputs)
            .map(inputName => tool.inputs[inputName])
            .map(input => input.toolIds.map((toolId, index, arr) => (
                <Input key={`${input.name}${toolId}`}>
                    <InputTarget />
                    {input.name}{arr.length > 1  && ` [${index}]`}
                    <InputType>:&nbsp;{input.type.toLowerCase()}</InputType>
                </Input>
            )))
        }
    </StyledWrapper>
);

export default ToolView;
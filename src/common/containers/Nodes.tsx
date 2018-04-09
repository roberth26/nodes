import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PanelGroup from 'react-panelgroup';
import { State } from '../types';
import {
    ToolHash,
    getToolsAsArray,
    Tool,
    ToolId,
    ToolView,
    ToolPosition,
    toolMoved,
    toolSelected,
    InputRef,
} from '../../tools';
import PropertyPane from './PropertyPane';
import { LogView } from '../../log';

type NodesProps = {
    activeTool: Tool;
    tools: ToolHash;
    onToolMove: (toolId: ToolId, toolPosition: ToolPosition) => void;
    onToolSelect: (toolId: ToolId) => void;
};

const Wrapper = styled.main`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #252e35;
`;

const Viewport = styled.div`
    width: 20000px;
    height: 20000px;
`;

const ViewportWrapper = styled.div`
    overflow: auto;
`;

const Layout = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;

    ${ViewportWrapper} {
        flex: 1;
    }

    ${PropertyPane} {
        flex-basis: 35%;
    }
`;

const Canvas = styled.canvas`
    position: absolute;
    top: 0;
    left: 0;
`;

class Nodes extends React.Component<NodesProps> {
    canvasElement: HTMLCanvasElement;
    toolIdToElementMap = new Map<ToolId, HTMLElement>();
    inputRefsHash: { [toolId: string]: InputRef[] } = {};

    handleCanvasRef = element => {
        this.canvasElement = element;
        this.forceUpdate();
    };

    createHandleToolViewRef = (toolId: ToolId) => (element: HTMLElement) => {
        if (element) {
            this.toolIdToElementMap.set(toolId, element);
        } else {
            this.toolIdToElementMap.delete(toolId);
        }
    };

    createHandleToolViewDrag = (toolId: ToolId) => (event: React.DragEvent<HTMLElement>) => {
        const { onToolMove } = this.props;

        if (onToolMove) {
            const element = this.toolIdToElementMap.get(toolId);
            const { pageX: x, pageY: y } = event;

            onToolMove(toolId, { x, y });
        }
    };

    createHandleToolViewClick = (toolId: ToolId) => (event: React.MouseEvent<HTMLElement>) => {
        const { onToolSelect } = this.props;

        if (onToolSelect) {
            onToolSelect(toolId);
        }
    };

    drawLines = () => {
        const { tools } = this.props;

        const ctx = this.canvasElement.getContext('2d');
        const { clientWidth, clientHeight } = this.canvasElement;

        ctx.clearRect(0, 0, clientWidth, clientHeight);
        ctx.strokeStyle = 'lightgrey';

        Array.from(this.toolIdToElementMap).forEach(([toolId, toolElement]) => {
            const { inputs } = tools[toolId];

            Object.keys(inputs)
                .map(inputName => inputs[inputName])
                .forEach(input => {
                    input.toolIds.forEach(inputToolId => {
                        const inputToolElement = this.toolIdToElementMap.get(inputToolId);

                        const {
                            top: inputTop,
                            left: inputLeft,
                            width: inputWidth,
                            height: inputHeight,
                        } = inputToolElement.getBoundingClientRect();

                        const startX = inputLeft + inputWidth;
                        const startY = inputTop + inputHeight / 2;

                        this.inputRefsHash[toolId]
                            .filter(inputRef => inputRef.toolId === inputToolId)
                            .forEach(inputRef => {
                                console.log(`line from ${inputToolId} to ${toolId}`);

                                const {
                                    top,
                                    left,
                                    height,
                                } = inputRef.element.getBoundingClientRect();
                                const endX = left;
                                const endY = top + height / 2;
                                const deltaX = endX - startX;
                                const deltaY = endY - startY;

                                ctx.beginPath();
                                ctx.moveTo(startX, startY);
                                ctx.bezierCurveTo(
                                    startX + deltaX / 2,
                                    startY,
                                    endX - deltaX / 2,
                                    endY,
                                    endX,
                                    endY
                                );
                                ctx.stroke();
                            });
                    });
                });
        });
    };

    componentDidUpdate() {
        this.drawLines();
    }

    componentDidMount() {
        this.drawLines();
        window.addEventListener('resize', this.drawLines);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.drawLines);
    }

    render() {
        const { tools, activeTool } = this.props;

        return (
            <Wrapper>
                <PanelGroup
                    borderColor="white"
                    panelWidths={[
                        {},
                        {
                            size: 300,
                        },
                    ]}
                >
                    <PanelGroup
                        borderColor="white"
                        direction="column"
                        panelWidths={[
                            {},
                            {
                                size: 300,
                            },
                        ]}
                    >
                        <ViewportWrapper>
                            <Viewport>
                                <Canvas
                                    innerRef={this.handleCanvasRef}
                                    width={2000}
                                    height={2000}
                                />
                                {Object.keys(tools)
                                    .map(toolId => tools[toolId])
                                    .map(tool => (
                                        <ToolView
                                            tool={tool}
                                            key={tool.id}
                                            innerRef={this.createHandleToolViewRef(tool.id)}
                                            onDrag={this.createHandleToolViewDrag(tool.id)}
                                            active={activeTool && activeTool.id === tool.id}
                                            onClick={this.createHandleToolViewClick(tool.id)}
                                            inputRefs={inputRefs =>
                                                (this.inputRefsHash[tool.id] = inputRefs)
                                            }
                                        />
                                    ))}
                            </Viewport>
                        </ViewportWrapper>
                        <LogView />
                    </PanelGroup>
                    <PropertyPane />
                </PanelGroup>
            </Wrapper>
        );
    }
}

const mapStateToProps = (state: State): Partial<NodesProps> => ({
    tools: state.tools.byId,
    activeTool: state.tools.byId[state.tools.activeToolId],
});

const mapDispatchToProps = (dispatch): Partial<NodesProps> => ({
    onToolMove: (toolId: ToolId, toolPosition: ToolPosition) =>
        dispatch(toolMoved(toolId, toolPosition)),
    onToolSelect: (toolId: ToolId) => dispatch(toolSelected(toolId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Nodes);

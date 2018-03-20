import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PanelGroup from 'react-panelgroup';
import { State } from '../types';
import {
    ToolMap,
    getToolsAsArray,
    Tool,
    ToolId,
    ToolView,
    ToolPosition,
    toolMoved,
    toolSelected
} from '../../tools';
import PropertyPane from './PropertyPane';
import { LogView } from '../../log';

type NodesProps = {
    activeTool: Tool;
    tools: ToolMap;
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
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

class Nodes extends React.Component<NodesProps> {
    canvasElement: HTMLCanvasElement;
    toolIdToElementMap = new Map<ToolId, HTMLElement>();

    handleCanvasRef = element => {
        this.canvasElement = element;
        this.forceUpdate();
    }

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

    componentDidUpdate() {
        const { tools } = this.props;

        const ctx = this.canvasElement.getContext('2d');
        const { clientWidth, clientHeight } = this.canvasElement;

        ctx.clearRect(0, 0, clientWidth, clientHeight);
        ctx.strokeStyle = 'lightgrey';

        Array.from(this.toolIdToElementMap)
            .forEach(([toolId, toolElement]) => {
                const { inputs } = tools[toolId];

                const {
                    top,
                    left,
                    width,
                    height
                } = toolElement.getBoundingClientRect();

                Object.keys(inputs)
                    .map(inputName => inputs[inputName])
                    .forEach(inputTool => {
                        inputTool.toolIds.forEach(toolId => {
                            const inputToolElement = this.toolIdToElementMap.get(toolId);

                            const {
                                top: inputTop,
                                left: inputLeft,
                                width: inputWidth,
                                height: inputHeight
                            } = inputToolElement.getBoundingClientRect();

                            const startX = inputLeft + inputWidth;
                            const startY = inputTop + inputHeight / 2;
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
                            size: 300
                        }
                    ]}
                >
                    <PanelGroup
                        borderColor="white"
                        direction="column"
                        panelWidths={[
                            {},
                            {
                                size: 300
                            }
                        ]}
                    >
                        <ViewportWrapper>
                            <Viewport>
                                <Canvas
                                    innerRef={this.handleCanvasRef}
                                    width={(this.canvasElement && this.canvasElement.clientWidth) || 600}
                                    height={(this.canvasElement && this.canvasElement.clientHeight) || 600}
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
                                        />
                                    ))
                                }
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
    activeTool: state.tools.byId[state.tools.activeToolId]
});

const mapDispatchToProps = (dispatch): Partial<NodesProps> => ({
    onToolMove: (toolId: ToolId, toolPosition: ToolPosition) => dispatch(toolMoved(toolId, toolPosition)),
    onToolSelect: (toolId: ToolId) => dispatch(toolSelected(toolId))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Nodes);
import * as generateId from 'shortid';
import { Tool, ToolImplementation, ToolFactory } from './types';

type RegistryEntry = {
    factory: ToolFactory;
    implementation: ToolImplementation;
    count: number;
};

class Registry {
    private entries = new Map<string, RegistryEntry>();

    register = (
        toolName: string,
        toolFactory: ToolFactory,
        toolImplementation: ToolImplementation
    ) => {
        const entry = {
            factory: toolFactory,
            implementation: toolImplementation,
            count: 0
        };
        
        this.entries.set(toolName, entry);
    };

    createToolInstance = (toolName: string): Tool => {
        const entry = this.entries.get(toolName);
        const { factory, count: previousCount } = entry;
        const count = previousCount + 1;
        const entryUpdated = {
            ...entry,
            count
        };
        this.entries.set(toolName, entryUpdated);

        const factoryResult = factory();

        return {
            label: `${factoryResult.name}${count}`,
            inputs: {},
            knobs: {},
            outputs: [],
            state: 'PENDING',
            position: {
                x: 0,
                y: 0
            },
            value: null,
            ...factoryResult,
            id: generateId()
        };
    };

    getToolNames = () => Array.from(this.entries.keys());

    getToolImplementation = (toolName: string) => {
        const { implementation } = this.entries.get(toolName);

        return implementation;
    };
}

export default new Registry();
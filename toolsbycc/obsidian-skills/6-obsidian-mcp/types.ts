/**
 * Container status types
 */
export type ContainerStatus = 'running' | 'starting' | 'stopped' | 'error' | 'unknown';

/**
 * Plugin settings interface
 */
export interface PluginSettings {
    containerName: string;
    autoStart: boolean;
}

/**
 * Default plugin settings
 */
export const DEFAULT_SETTINGS: PluginSettings = {
    containerName: 'obsidian-mcp-server',
    autoStart: true
};

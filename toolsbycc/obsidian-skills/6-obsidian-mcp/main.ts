import { Plugin, Notice } from 'obsidian';
import { PluginSettings, DEFAULT_SETTINGS } from './types';
import { DockerManager } from './docker-manager';
import { StatusBarManager } from './status-bar';
import { LogModal } from './log-modal';
import { SettingsTab } from './settings';

/**
 * Obsidian MCP Manager Plugin
 * Manages the lifecycle of Obsidian MCP Server Docker container
 */
export default class ObsidianMCPPlugin extends Plugin {
    settings: PluginSettings;
    dockerManager: DockerManager;
    statusBarItem: StatusBarManager;
    logModal: LogModal;

    async onload() {
        console.log('Loading Obsidian MCP Manager plugin');

        // 1. 加载配置
        await this.loadSettings();

        // 2. 初始化 Docker 管理器
        this.dockerManager = new DockerManager(this.settings);

        // 3. 创建状态栏图标（同步）
        this.statusBarItem = new StatusBarManager(
            this.addStatusBarItem(),
            this.dockerManager,
            this.app
        );

        // 4. 注册命令
        this.addCommand({
            id: 'view-logs',
            name: 'View MCP Server Logs',
            callback: () => this.openLogModal()
        });

        this.addCommand({
            id: 'restart-container',
            name: 'Restart MCP Server',
            callback: () => this.restartContainer()
        });

        this.addCommand({
            id: 'stop-container',
            name: 'Stop MCP Server',
            callback: () => this.stopContainer()
        });

        // 5. 异步启动容器（不阻塞）
        if (this.settings.autoStart) {
            this.startContainerAsync();
        }

        // 6. 注册设置面板
        this.addSettingTab(new SettingsTab(this.app, this));

        console.log('Obsidian MCP Manager plugin loaded');
    }

    async onunload() {
        console.log('Unloading Obsidian MCP Manager plugin');

        // 清理状态栏资源
        if (this.statusBarItem) {
            this.statusBarItem.destroy();
        }

        // 停止容器
        if (this.dockerManager) {
            await this.dockerManager.stop();
        }
    }

    /**
     * 异步启动容器（不阻塞 Obsidian 启动）
     */
    private async startContainerAsync() {
        try {
            this.statusBarItem.setStatus('starting');
            await this.dockerManager.start();
            this.statusBarItem.setStatus('running');
            new Notice('MCP Server 已启动');
        } catch (error) {
            this.statusBarItem.setStatus('error');
            new Notice('MCP Server 启动失败，点击状态栏图标查看日志或手动重试');
            console.error('Failed to start MCP Server:', error);
        }
    }

    /**
     * 重启容器
     */
    private async restartContainer() {
        try {
            new Notice('正在重启 MCP Server...');
            this.statusBarItem.setStatus('starting');
            await this.dockerManager.restart();
            this.statusBarItem.setStatus('running');
            new Notice('MCP Server 已重启');
        } catch (error) {
            this.statusBarItem.setStatus('error');
            new Notice('MCP Server 重启失败');
            console.error('Failed to restart MCP Server:', error);
        }
    }

    /**
     * 停止容器
     */
    private async stopContainer() {
        try {
            await this.dockerManager.stop();
            this.statusBarItem.setStatus('stopped');
            new Notice('MCP Server 已停止');
        } catch (error) {
            new Notice('停止 MCP Server 失败');
            console.error('Failed to stop MCP Server:', error);
        }
    }

    /**
     * 打开日志查看器
     */
    private openLogModal() {
        if (!this.logModal) {
            this.logModal = new LogModal(this.app, this.dockerManager);
        }
        this.logModal.open();
    }

    /**
     * 加载设置
     */
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    /**
     * 保存设置
     */
    async saveSettings() {
        await this.saveData(this.settings);
    }
}

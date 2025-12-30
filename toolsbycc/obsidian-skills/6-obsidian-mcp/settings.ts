import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import ObsidianMCPPlugin from './main';

/**
 * Settings Tab
 * Provides UI for plugin configuration
 */
export class SettingsTab extends PluginSettingTab {
    plugin: ObsidianMCPPlugin;

    constructor(app: App, plugin: ObsidianMCPPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Obsidian MCP Server 设置' });

        // 容器名称设置
        new Setting(containerEl)
            .setName('MCP Server 容器名称')
            .setDesc('Obsidian MCP Server 的 Docker 容器名称')
            .addText(text => text
                .setPlaceholder('obsidian-mcp-server')
                .setValue(this.plugin.settings.containerName)
                .onChange(async (value) => {
                    this.plugin.settings.containerName = value;
                    await this.plugin.saveSettings();
                    // 更新 Docker 管理器的容器名
                    new Notice('容器名称已更新，下次启动时生效');
                }));

        // 自动启动开关
        new Setting(containerEl)
            .setName('自动启动 MCP Server')
            .setDesc('Obsidian 启动时自动启动 MCP Server 容器')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoStart)
                .onChange(async (value) => {
                    this.plugin.settings.autoStart = value;
                    await this.plugin.saveSettings();
                    new Notice(`自动启动已${value ? '启用' : '禁用'}`);
                }));

        // 容器状态信息
        containerEl.createEl('h3', { text: '容器状态' });

        const statusContainer = containerEl.createDiv();
        statusContainer.style.marginBottom = '20px';

        // 异步加载容器状态
        this.showContainerStatus(statusContainer);

        // 测试连接按钮
        new Setting(containerEl)
            .setName('测试 Docker 连接')
            .setDesc('测试 Docker 是否可用以及容器是否存在')
            .addButton(button => button
                .setButtonText('测试连接')
                .onClick(async () => {
                    await this.testDockerConnection();
                }));

        // 刷新状态按钮
        new Setting(containerEl)
            .setName('刷新容器状态')
            .setDesc('强制刷新容器状态显示')
            .addButton(button => button
                .setButtonText('刷新')
                .onClick(async () => {
                    statusContainer.empty();
                    await this.showContainerStatus(statusContainer);
                    new Notice('状态已刷新');
                }));

        // 帮助信息
        containerEl.createEl('h3', { text: '帮助' });

        const helpDiv = containerEl.createDiv();
        helpDiv.style.padding = '10px';
        helpDiv.style.backgroundColor = '#f0f0f0';
        helpDiv.style.borderRadius = '5px';
        helpDiv.style.marginTop = '10px';

        helpDiv.createEl('p', {
            text: '此插件管理 Obsidian MCP Server 的 Docker 容器生命周期。'
        });

        helpDiv.createEl('p', {
            text: '功能：'
        });

        const featureList = helpDiv.createEl('ul');
        featureList.createEl('li', { text: '自动启动/停止容器（随 Obsidian 启动/关闭）' });
        featureList.createEl('li', { text: '状态栏显示容器状态' });
        featureList.createEl('li', { text: '右键菜单快速操作（重启、停止、查看日志）' });
        featureList.createEl('li', { text: '命令面板集成' });

        helpDiv.createEl('p', {
            text: '提示：右键点击状态栏图标可快速重启或停止容器。'
        });
    }

    /**
     * 显示容器状态
     */
    private async showContainerStatus(containerEl: HTMLElement) {
        try {
            // 清除缓存以获取最新状态
            this.plugin.dockerManager.clearCache();
            const status = await this.plugin.dockerManager.getStatus();

            const statusDiv = containerEl.createEl('div', {
                cls: 'mcp-status-info'
            });

            statusDiv.style.padding = '10px';
            statusDiv.style.marginTop = '10px';
            statusDiv.style.borderRadius = '5px';

            // 根据状态设置样式
            let bgColor: string;
            let textColor: string;
            let statusText: string;

            switch (status) {
                case 'running':
                    bgColor = '#d4edda';
                    textColor = '#155724';
                    statusText = '✅ 运行中';
                    break;
                case 'stopped':
                    bgColor = '#f8d7da';
                    textColor = '#721c24';
                    statusText = '🔴 已停止';
                    break;
                case 'starting':
                    bgColor = '#fff3cd';
                    textColor = '#856404';
                    statusText = '🟡 启动中';
                    break;
                case 'error':
                    bgColor = '#f8d7da';
                    textColor = '#721c24';
                    statusText = '⚠️ 错误';
                    break;
                default:
                    bgColor = '#e2e3e5';
                    textColor = '#383d41';
                    statusText = '❓ 未知';
            }

            statusDiv.style.backgroundColor = bgColor;
            statusDiv.style.color = textColor;
            statusDiv.style.fontWeight = 'bold';

            statusDiv.createEl('div', {
                text: `当前容器状态: ${statusText}`
            });

            statusDiv.createEl('div', {
                text: `容器名称: ${this.plugin.settings.containerName}`,
                attr: {
                    style: 'margin-top: 5px; font-size: 0.9em; font-weight: normal;'
                }
            });

        } catch (error) {
            const errorDiv = containerEl.createEl('div', {
                text: `无法获取容器状态: ${error.message}`
            });
            errorDiv.style.padding = '10px';
            errorDiv.style.backgroundColor = '#f8d7da';
            errorDiv.style.color = '#721c24';
            errorDiv.style.borderRadius = '5px';
            errorDiv.style.marginTop = '10px';
        }
    }

    /**
     * 测试 Docker 连接
     */
    private async testDockerConnection() {
        try {
            const status = await this.plugin.dockerManager.getStatus();

            let message: string;
            switch (status) {
                case 'running':
                    message = '✅ Docker 连接成功！容器正在运行。';
                    break;
                case 'stopped':
                    message = '✅ Docker 连接成功！容器已停止。';
                    break;
                case 'unknown':
                    message = '⚠️ Docker 连接成功，但容器不存在或名称不正确。';
                    break;
                default:
                    message = `⚠️ Docker 连接成功，容器状态: ${status}`;
            }

            new Notice(message, 5000);
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            new Notice(`❌ Docker 连接失败: ${errorMsg}`, 5000);
            console.error('Docker connection test failed:', error);
        }
    }
}

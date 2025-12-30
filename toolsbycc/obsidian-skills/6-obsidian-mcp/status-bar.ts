import { App, Menu, Notice } from 'obsidian';
import { ContainerStatus } from './types';
import { DockerManager } from './docker-manager';

/**
 * Status Bar Manager
 * Displays container status and provides quick actions
 */
export class StatusBarManager {
    private statusBarEl: HTMLElement;
    private dockerManager: DockerManager;
    private app: App;
    private updateInterval: NodeJS.Timeout | null = null;

    private statusIcons = {
        running: '🟢',
        starting: '🟡',
        stopped: '🔴',
        error: '⚠️',
        unknown: '❓'
    };

    constructor(statusBarEl: HTMLElement, dockerManager: DockerManager, app: App) {
        this.statusBarEl = statusBarEl;
        this.dockerManager = dockerManager;
        this.app = app;

        // 初始化状态
        this.setStatus('starting');

        // 注册点击事件（快速刷新状态）
        this.statusBarEl.addEventListener('click', () => {
            this.refreshStatus();
        });

        // 注册右键菜单
        this.statusBarEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e);
        });

        // 定期更新状态（每30秒检测容器状态变化）
        this.updateInterval = setInterval(() => this.updateStatus(), 30000);
    }

    /**
     * 设置状态栏显示
     */
    setStatus(status: ContainerStatus) {
        const icon = this.statusIcons[status] || this.statusIcons.unknown;
        this.statusBarEl.setText(`${icon} MCP`);
        this.statusBarEl.title = `MCP Server 状态: ${this.getStatusText(status)}`;
    }

    /**
     * 异步更新状态（静默）
     */
    private async updateStatus() {
        try {
            const status = await this.dockerManager.getStatus();
            this.setStatus(status);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    }

    /**
     * 刷新状态（带反馈）
     */
    private async refreshStatus() {
        try {
            this.dockerManager.clearCache(); // 清除缓存强制刷新
            const status = await this.dockerManager.getStatus();
            this.setStatus(status);
            new Notice(`MCP Server 状态: ${this.getStatusText(status)}`);
        } catch (error) {
            new Notice('无法获取容器状态');
            console.error('Failed to refresh status:', error);
        }
    }

    /**
     * 显示右键菜单
     */
    private showContextMenu(event: MouseEvent) {
        const menu = new Menu();

        menu.addItem((item) => {
            item.setTitle('刷新状态')
                .setIcon('refresh-cw')
                .onClick(() => this.refreshStatus());
        });

        menu.addSeparator();

        menu.addItem((item) => {
            item.setTitle('重启 MCP Server')
                .setIcon('rotate-cw')
                .onClick(async () => {
                    try {
                        new Notice('正在重启 MCP Server...');
                        this.setStatus('starting');
                        await this.dockerManager.restart();
                        this.setStatus('running');
                        new Notice('MCP Server 已重启');
                    } catch (error) {
                        this.setStatus('error');
                        new Notice('MCP Server 重启失败');
                        console.error('Failed to restart:', error);
                    }
                });
        });

        menu.addItem((item) => {
            item.setTitle('停止 MCP Server')
                .setIcon('square')
                .onClick(async () => {
                    try {
                        await this.dockerManager.stop();
                        this.setStatus('stopped');
                        new Notice('MCP Server 已停止');
                    } catch (error) {
                        new Notice('停止 MCP Server 失败');
                        console.error('Failed to stop:', error);
                    }
                });
        });

        menu.addSeparator();

        menu.addItem((item) => {
            item.setTitle('查看日志')
                .setIcon('file-text')
                .onClick(() => {
                    // 触发日志查看器命令
                    (this.app as any).commands.executeCommandById('obsidian-mcp:view-logs');
                });
        });

        menu.addSeparator();

        menu.addItem((item) => {
            item.setTitle('打开设置')
                .setIcon('settings')
                .onClick(() => {
                    // 打开设置面板并定位到插件设置
                    (this.app as any).setting.open();
                    (this.app as any).setting.openTabById('obsidian-mcp');
                });
        });

        menu.showAtMouseEvent(event);
    }

    /**
     * 获取状态文本
     */
    private getStatusText(status: ContainerStatus): string {
        const texts: Record<ContainerStatus, string> = {
            running: '运行中',
            starting: '启动中',
            stopped: '已停止',
            error: '错误',
            unknown: '未知'
        };
        return texts[status] || '未知';
    }

    /**
     * 清理资源
     */
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

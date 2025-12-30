import { App, Modal } from 'obsidian';
import { DockerManager } from './docker-manager';

/**
 * Log Modal
 * Displays container logs in a modal dialog
 */
export class LogModal extends Modal {
    private dockerManager: DockerManager;
    private logContent: HTMLPreElement;
    private autoRefresh: boolean = false;
    private refreshInterval: NodeJS.Timeout | null = null;

    constructor(app: App, dockerManager: DockerManager) {
        super(app);
        this.dockerManager = dockerManager;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        // 设置模态窗口样式
        this.modalEl.style.width = '80%';
        this.modalEl.style.maxWidth = '1000px';

        // 标题
        contentEl.createEl('h2', { text: 'MCP Server 日志' });

        // 工具栏
        const toolbar = contentEl.createDiv({ cls: 'log-toolbar' });
        toolbar.style.marginBottom = '10px';
        toolbar.style.display = 'flex';
        toolbar.style.gap = '10px';
        toolbar.style.alignItems = 'center';

        // 刷新按钮
        const refreshBtn = toolbar.createEl('button', { text: '🔄 刷新' });
        refreshBtn.style.padding = '5px 10px';
        refreshBtn.style.cursor = 'pointer';
        refreshBtn.onclick = () => this.refreshLogs();

        // 自动刷新开关
        const autoRefreshLabel = toolbar.createEl('label');
        autoRefreshLabel.style.display = 'flex';
        autoRefreshLabel.style.alignItems = 'center';
        autoRefreshLabel.style.gap = '5px';

        const autoRefreshCheckbox = autoRefreshLabel.createEl('input', {
            type: 'checkbox'
        });
        autoRefreshCheckbox.checked = this.autoRefresh;
        autoRefreshCheckbox.onchange = () => {
            this.autoRefresh = autoRefreshCheckbox.checked;
            this.toggleAutoRefresh();
        };

        autoRefreshLabel.createEl('span', { text: '自动刷新（每5秒）' });

        // 清空显示按钮
        const clearBtn = toolbar.createEl('button', { text: '清空显示' });
        clearBtn.style.padding = '5px 10px';
        clearBtn.style.cursor = 'pointer';
        clearBtn.onclick = () => {
            this.logContent.empty();
            this.logContent.setText('(显示已清空，点击刷新按钮重新加载日志)');
        };

        // 复制日志按钮
        const copyBtn = toolbar.createEl('button', { text: '📋 复制日志' });
        copyBtn.style.padding = '5px 10px';
        copyBtn.style.cursor = 'pointer';
        copyBtn.onclick = () => this.copyLogs();

        // 日志行数选择
        const linesLabel = toolbar.createEl('label');
        linesLabel.style.display = 'flex';
        linesLabel.style.alignItems = 'center';
        linesLabel.style.gap = '5px';
        linesLabel.style.marginLeft = 'auto';

        linesLabel.createEl('span', { text: '显示行数:' });

        const linesSelect = linesLabel.createEl('select');
        linesSelect.style.padding = '5px';
        [50, 100, 200, 500, 1000].forEach(num => {
            const option = linesSelect.createEl('option', {
                text: num.toString(),
                value: num.toString()
            });
            if (num === 100) option.selected = true;
        });
        linesSelect.onchange = () => this.refreshLogs(parseInt(linesSelect.value));

        // 日志内容区域
        this.logContent = contentEl.createEl('pre', {
            cls: 'mcp-server-logs'
        });

        this.logContent.style.maxHeight = '500px';
        this.logContent.style.overflowY = 'auto';
        this.logContent.style.overflowX = 'auto';
        this.logContent.style.background = '#1e1e1e';
        this.logContent.style.color = '#d4d4d4';
        this.logContent.style.padding = '15px';
        this.logContent.style.fontFamily = 'monospace';
        this.logContent.style.fontSize = '12px';
        this.logContent.style.lineHeight = '1.5';
        this.logContent.style.borderRadius = '5px';
        this.logContent.style.whiteSpace = 'pre-wrap';
        this.logContent.style.wordBreak = 'break-all';

        // 初始加载日志
        this.refreshLogs();
    }

    /**
     * 刷新日志
     */
    private async refreshLogs(lines: number = 100) {
        try {
            this.logContent.setText('正在加载日志...');

            const logs = await this.dockerManager.getLogs(lines);

            if (!logs || logs.trim() === '') {
                this.logContent.setText('(容器日志为空)');
            } else {
                this.logContent.setText(logs);

                // 自动滚动到底部
                requestAnimationFrame(() => {
                    this.logContent.scrollTop = this.logContent.scrollHeight;
                });
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            this.logContent.setText(`❌ 无法加载日志: ${errorMsg}`);
            console.error('Failed to load logs:', error);
        }
    }

    /**
     * 切换自动刷新
     */
    private toggleAutoRefresh() {
        if (this.autoRefresh) {
            // 启动自动刷新
            this.refreshInterval = setInterval(() => {
                this.refreshLogs();
            }, 5000);
        } else {
            // 停止自动刷新
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
                this.refreshInterval = null;
            }
        }
    }

    /**
     * 复制日志到剪贴板
     */
    private async copyLogs() {
        try {
            const logs = this.logContent.textContent || '';
            await navigator.clipboard.writeText(logs);

            // 临时显示复制成功提示
            const originalText = this.logContent.textContent;
            this.logContent.setText('✅ 日志已复制到剪贴板！\n\n' + logs);

            setTimeout(() => {
                if (originalText) {
                    this.logContent.setText(originalText);
                }
            }, 1000);
        } catch (error) {
            console.error('Failed to copy logs:', error);
            this.logContent.setText('❌ 复制失败\n\n' + this.logContent.textContent);
        }
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();

        // 清理自动刷新定时器
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
}

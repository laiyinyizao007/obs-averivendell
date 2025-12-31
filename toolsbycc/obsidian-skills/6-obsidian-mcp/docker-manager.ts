import { PluginSettings, ContainerStatus } from './types';
import { spawn } from 'child_process';

/**
 * Docker Manager
 * Handles Docker container lifecycle management
 */
export class DockerManager {
    private containerName: string;
    private statusCache: ContainerStatus | null = null;
    private statusCacheTime: number = 0;
    private readonly CACHE_TTL = 5000; // 5秒缓存
    private readonly MAX_RETRIES = 3;

    constructor(settings: PluginSettings) {
        this.containerName = settings.containerName;
    }

    /**
     * 启动容器（带重试机制）
     */
    async start(): Promise<void> {
        console.log(`Starting container: ${this.containerName}`);

        for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
            try {
                await this.execDocker(['start', this.containerName]);
                this.statusCache = 'running';
                this.statusCacheTime = Date.now();
                console.log(`Container ${this.containerName} started successfully`);
                return;
            } catch (error) {
                console.warn(`Start attempt ${attempt}/${this.MAX_RETRIES} failed:`, error);

                if (attempt === this.MAX_RETRIES) {
                    throw new Error(`Failed to start container after ${this.MAX_RETRIES} attempts: ${error}`);
                }

                // 指数退避：2秒, 4秒, 8秒
                const delay = Math.pow(2, attempt) * 1000;
                console.log(`Retrying in ${delay}ms...`);
                await this.sleep(delay);
            }
        }
    }

    /**
     * 停止容器
     */
    async stop(): Promise<void> {
        try {
            console.log(`Stopping container: ${this.containerName}`);
            await this.execDocker(['stop', this.containerName]);
            this.statusCache = 'stopped';
            this.statusCacheTime = Date.now();
            console.log(`Container ${this.containerName} stopped successfully`);
        } catch (error) {
            console.error('Failed to stop container:', error);
            // 不抛出异常，因为停止失败不应该阻塞 Obsidian 关闭
        }
    }

    /**
     * 重启容器
     */
    async restart(): Promise<void> {
        console.log(`Restarting container: ${this.containerName}`);
        await this.stop();
        await this.sleep(1000); // 等待容器完全停止
        await this.start();
    }

    /**
     * 获取容器状态（带缓存）
     */
    async getStatus(): Promise<ContainerStatus> {
        // 使用缓存避免频繁调用 Docker
        if (this.statusCache && Date.now() - this.statusCacheTime < this.CACHE_TTL) {
            return this.statusCache;
        }

        try {
            const output = await this.execDocker([
                'ps',
                '-a',
                '--filter', `name=^/${this.containerName}$`,
                '--format', '{{.Status}}'
            ]);

            let status: ContainerStatus;
            if (output.includes('Up')) {
                status = 'running';
            } else if (output.includes('Exited')) {
                status = 'stopped';
            } else if (output.trim() === '') {
                status = 'unknown'; // 容器不存在
            } else {
                status = 'unknown';
            }

            this.statusCache = status;
            this.statusCacheTime = Date.now();
            return status;
        } catch (error) {
            console.error('Failed to get container status:', error);
            return 'error';
        }
    }

    /**
     * 获取容器日志
     */
    async getLogs(lines: number = 100): Promise<string> {
        try {
            const output = await this.execDocker([
                'logs',
                '--tail', lines.toString(),
                this.containerName
            ]);
            return output || '(容器日志为空)';
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            return `无法获取日志: ${errorMsg}`;
        }
    }

    /**
     * 清除状态缓存（用于强制刷新）
     */
    clearCache(): void {
        this.statusCache = null;
        this.statusCacheTime = 0;
    }

    /**
     * 执行 Docker 命令
     */
    private async execDocker(args: string[]): Promise<string> {
        return new Promise((resolve, reject) => {
            // 使用 Docker 完整路径，因为 Electron 环境的 PATH 可能找不到 docker
            // 尝试常见路径：/usr/bin/docker (Linux), /usr/local/bin/docker (macOS/Homebrew)
            const dockerPath = process.platform === 'darwin'
                ? '/usr/local/bin/docker'
                : '/usr/bin/docker';

            const dockerProcess = spawn(dockerPath, args);
            let stdout = '';
            let stderr = '';

            dockerProcess.stdout.on('data', (data: Buffer) => {
                stdout += data.toString();
            });

            dockerProcess.stderr.on('data', (data: Buffer) => {
                stderr += data.toString();
            });

            dockerProcess.on('error', (error: Error) => {
                reject(new Error(`Failed to spawn docker process: ${error.message}`));
            });

            dockerProcess.on('close', (code: number) => {
                if (code === 0) {
                    resolve(stdout.trim());
                } else {
                    const errorMsg = stderr.trim() || `Docker command failed with exit code ${code}`;
                    reject(new Error(errorMsg));
                }
            });
        });
    }

    /**
     * 延迟辅助函数
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

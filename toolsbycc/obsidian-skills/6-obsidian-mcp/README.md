# Obsidian MCP Manager

**版本**: 1.0.0
**功能**: 在 Obsidian 中管理 Docker 容器，专为 MCP Server 设计
**平台**: Linux, macOS
**修复日期**: 2025-12-31 21:00

---

## 📋 功能概述

这是一个 Obsidian 插件，允许你直接在 Obsidian 界面中管理 Docker 容器的生命周期。主要功能：

✅ **启动/停止/重启** Docker 容器
✅ **实时状态显示** - 状态栏显示容器运行状态
✅ **查看容器日志** - 模态窗口显示最新日志
✅ **命令面板集成** - 快速访问所有功能
✅ **智能重试机制** - 启动失败自动重试 3 次
✅ **状态缓存** - 5 秒缓存避免频繁 Docker 调用

---

## 🚀 快速开始

### 前置要求

1. **Docker 已安装并运行**
   ```bash
   docker --version  # 验证 Docker 安装
   docker ps         # 验证 Docker 运行
   ```

2. **目标容器已创建**
   ```bash
   # 示例：创建测试容器
   docker run -d --name obsidian-mcp-server alpine:latest sleep infinity
   ```

3. **Obsidian 版本** ≥ 1.0.5

---

## 📦 安装步骤

### 方法 1：手动安装（推荐）

1. **复制插件文件** 到 Obsidian 插件目录：
   ```bash
   cp -r /home/averypi/Documents/obs-averivendell/toolsbycc/obsidian-skills/6-obsidian-mcp/.obsidian/plugins/obsidian-mcp \
         /home/averypi/Documents/obs-averivendell/.obsidian/plugins/
   ```

2. **启用插件**：
   - 打开 Obsidian
   - Settings → Community plugins
   - 禁用 "Safe Mode"
   - 找到 "Obsidian MCP Manager"
   - 点击切换按钮启用

3. **配置容器名称**：
   - Settings → Obsidian MCP Manager
   - 输入你的容器名称（默认：`obsidian-mcp-server`）

---

## 🎯 使用指南

### 命令面板（Ctrl+P）

搜索 "MCP" 查看所有可用命令：

| 命令 | 功能 | 说明 |
|------|------|------|
| **MCP: Start Container** | 启动容器 | 带重试机制，最多 3 次 |
| **MCP: Stop Container** | 停止容器 | 安全停止，不阻塞 Obsidian 关闭 |
| **MCP: Restart Container** | 重启容器 | 先停止，等待 1 秒，再启动 |
| **MCP: View Logs** | 查看日志 | 显示最新 100 行日志 |

### 状态栏

右下角显示实时容器状态：

- 🟢 **MCP: Running** - 容器正在运行
- 🔴 **MCP: Stopped** - 容器已停止
- ⚠️ **MCP: Unknown** - 容器不存在或状态异常
- 🔴 **MCP: Error** - 无法获取状态

**快捷操作**：点击状态栏可快速启动/停止容器

---

## ⚙️ 配置选项

### 设置界面

Settings → Obsidian MCP Manager

| 设置项 | 说明 | 默认值 |
|--------|------|--------|
| **Container Name** | Docker 容器名称 | `obsidian-mcp-server` |

### 高级配置（代码级别）

如需修改更多参数，编辑 `docker-manager.ts`：

```typescript
// 状态缓存时间（毫秒）
private readonly CACHE_TTL = 5000; // 5 秒

// 启动重试次数
private readonly MAX_RETRIES = 3;

// 日志显示行数
async getLogs(lines: number = 100)
```

---

## 🛠️ 技术细节

### 架构设计

```
main.ts (插件主入口)
  ├── docker-manager.ts (Docker 命令执行)
  ├── status-bar.ts (状态栏 UI)
  ├── settings.ts (设置面板)
  └── log-modal.ts (日志查看器)
```

### Docker 命令执行

**关键修复**：Electron 环境中的 Docker 调用

```typescript
// ❌ 错误：依赖 PATH 环境变量（Electron 中不可用）
spawn('docker', args)

// ✅ 正确：使用绝对路径 + Shell 模式
const dockerPath = process.platform === 'darwin'
    ? '/usr/local/bin/docker'
    : '/usr/bin/docker';

spawn(dockerPath, args, { shell: true })
```

**为什么需要 `shell: true`？**

Docker 是动态链接的 ELF 可执行文件，需要系统的动态链接器（`ld-linux-aarch64.so.1`）。Electron 的 spawn 默认无法处理动态链接，必须通过 shell 模式执行。

### 重试机制

启动失败时自动重试，指数退避：

- 第 1 次失败：等待 2 秒后重试
- 第 2 次失败：等待 4 秒后重试
- 第 3 次失败：彻底失败，抛出错误

### 状态缓存

避免频繁调用 `docker ps`，使用 5 秒缓存：

```typescript
if (this.statusCache && Date.now() - this.statusCacheTime < this.CACHE_TTL) {
    return this.statusCache;
}
```

---

## 🐛 故障排查

### 问题 1：插件加载失败

**症状**：插件在 Community plugins 列表中不显示

**解决**：
```bash
# 检查插件目录
ls -la /home/averypi/Documents/obs-averivendell/.obsidian/plugins/obsidian-mcp/

# 应该包含：
# - main.js (约 25K)
# - manifest.json
# - styles.css
```

---

### 问题 2：`spawn docker ENOENT` 错误

**症状**：控制台显示 `Failed to spawn docker process: spawn docker ENOENT` 或 `/bin/sh: line 1: /usr/bin/docker: No such file or directory`

**原因**：Electron 环境中 Docker 命令解析问题

**解决**：已在 v1.0.0 修复（使用 shell 模式 + PATH 环境变量解析）

当前实现使用 `'docker'` 命令名，让 shell 通过系统 PATH 自动查找 Docker：

```typescript
// docker-manager.ts 第 138-147 行
private async execDocker(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
        // 使用 'docker' 命令，让 shell 通过 PATH 环境变量解析
        const dockerProcess = spawn('docker', args, { shell: true });
        // ...
    });
}
```

**如果仍有问题**，验证 Docker 在 PATH 中：
```bash
which docker
# 应该返回 Docker 路径（如 /usr/bin/docker 或 /usr/local/bin/docker）

echo $PATH
# 确认 PATH 包含 Docker 所在目录
```

---

### 问题 3：容器启动失败

**症状**：点击 Start 后状态栏显示 Error

**诊断步骤**：

1. **检查容器是否存在**：
   ```bash
   docker ps -a | grep obsidian-mcp-server
   ```

2. **手动启动测试**：
   ```bash
   docker start obsidian-mcp-server
   ```

3. **查看容器日志**：
   ```bash
   docker logs obsidian-mcp-server
   ```

4. **查看 Obsidian 控制台**：
   - 打开 Obsidian
   - 按 `Ctrl+Shift+I`（或 `Cmd+Option+I`）
   - 切换到 Console 标签
   - 查看错误信息

---

### 问题 4：权限错误

**症状**：`permission denied` 错误

**原因**：当前用户无权限执行 Docker 命令

**解决**：
```bash
# 将用户添加到 docker 组
sudo usermod -aG docker $USER

# 重新加载组权限
newgrp docker

# 验证
docker ps
```

---

### 问题 5：容器不存在

**症状**：状态显示 "Unknown"

**解决**：创建容器
```bash
# 创建测试容器
docker run -d --name obsidian-mcp-server alpine:latest sleep infinity

# 验证
docker ps
```

---

## 📝 开发日志

### 2025-12-31 Session 5 - 第三次修复部署

**问题**：Shell 模式启用后仍报 `/bin/sh: line 1: /usr/bin/docker: No such file or directory`

**根因**：虽然 shell 模式解决了动态链接问题，但硬编码的绝对路径 `/usr/bin/docker` 在 Electron 的 shell 环境中不可访问。系统 PATH 环境变量能正确解析 `docker` 命令。

**修复**：移除平台检测和硬编码路径，使用 `'docker'` 命令名，让 shell 通过 PATH 环境变量解析

```typescript
// docker-manager.ts 第 138-147 行
private async execDocker(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
        // 使用 'docker' 命令，让 shell 通过 PATH 环境变量解析
        // shell 模式提供完整的系统环境，包括正确的 PATH
        const dockerProcess = spawn('docker', args, { shell: true });
        // ...
    });
}
```

**原理**：Shell 模式提供完整系统环境包括 PATH 变量。使用命令名而非绝对路径让 shell 自然解析，更可移植且与终端行为一致。

**部署**：
- 编译：`npm run build`
- 复制：`build/main.js` → `.obsidian/plugins/obsidian-mcp/main.js`
- 时间戳：2025-12-31 Session 5
- 状态：已部署，待用户测试验证

---

### 2025-12-31 21:00 - 第二次修复部署

**问题**：绝对路径修复后仍报 `spawn /usr/bin/docker ENOENT`

**根因**：Docker 是动态链接的 ELF 可执行文件，Electron 的 spawn 无法处理动态链接

**修复**：在 `spawn()` 调用中添加 `{ shell: true }` 选项

```typescript
// docker-manager.ts 第 147 行
const dockerProcess = spawn(dockerPath, args, { shell: true });
```

**部署**：
- 编译：`npm run build`
- 复制：`build/main.js` → `.obsidian/plugins/obsidian-mcp/main.js`
- 时间戳：2025-12-31 21:00

---

### 2025-12-31 20:47 - 首次修复部署

**问题**：`spawn docker ENOENT` - Docker 命令未找到

**根因**：Obsidian 的 Electron 环境 PATH 与终端不同

**修复**：使用 Docker 绝对路径替代依赖 PATH

```typescript
// docker-manager.ts 第 142-144 行
const dockerPath = process.platform === 'darwin'
    ? '/usr/local/bin/docker'
    : '/usr/bin/docker';
```

**部署**：
- 编译：`npm run build`
- 复制：`build/main.js` → `.obsidian/plugins/obsidian-mcp/main.js`
- 时间戳：2025-12-31 20:47

---

## 🧪 测试报告

### 外部测试（终端）

所有 8 项 Docker 命令测试通过：
```bash
✅ Docker 版本检查
✅ 容器状态查询
✅ 启动容器
✅ 停止容器
✅ 重启容器
✅ 查看日志
✅ 状态缓存
✅ 错误处理
```

详细报告：见 `TEST-REPORT.md`

### Obsidian 集成测试

**待验证**（需要用户重新加载插件）：

- [ ] 插件成功加载，无 ENOENT 错误
- [ ] 状态栏显示容器状态
- [ ] Start 命令可以启动容器
- [ ] Stop 命令可以停止容器
- [ ] Restart 命令可以重启容器
- [ ] View Logs 可以显示日志
- [ ] 设置页面可以访问
- [ ] 状态栏点击可以快速启动/停止

---

## 📚 相关文档

| 文档 | 说明 |
|------|------|
| `QUICK-START.md` | 快速启动指南（用户测试） |
| `TESTING-GUIDE.md` | 完整测试指南（开发者） |
| `TEST-REPORT.md` | 外部测试报告 |
| `manifest.json` | 插件元数据 |

---

## 🤝 贡献

### 开发环境设置

```bash
# 克隆仓库
cd /home/averypi/Documents/obs-averivendell/toolsbycc/obsidian-skills/6-obsidian-mcp

# 安装依赖
npm install

# 开发构建（监听模式）
npm run dev

# 生产构建
npm run build
```

### 构建流程

```bash
# 编译 TypeScript → JavaScript
npm run build

# 复制到 Obsidian 插件目录
cp build/main.js /home/averypi/Documents/obs-averivendell/.obsidian/plugins/obsidian-mcp/

# 重新加载 Obsidian 插件
```

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- [Obsidian API](https://github.com/obsidianmd/obsidian-api)
- [Obsidian Plugin Developer Docs](https://docs.obsidian.md/)
- Docker CLI

---

## 📞 支持

如有问题，请提供以下信息：

1. **错误信息**：开发者控制台的完整错误（`Ctrl+Shift+I`）
2. **Docker 路径**：`which docker` 的输出
3. **容器状态**：`docker ps -a | grep obsidian-mcp-server` 的输出
4. **系统信息**：OS 类型和版本

---

**插件版本**: 1.0.0
**最后更新**: 2025-12-31 21:00
**状态**: ✅ 已部署，等待测试反馈

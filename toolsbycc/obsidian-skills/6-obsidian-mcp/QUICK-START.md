# 🚀 快速开始 - Obsidian MCP Manager

## ✅ 修复完成（Fix #3）

**问题**: 插件加载成功但启动失败
```
/bin/sh: line 1: /usr/bin/docker: No such file or directory
```

**原因**: 硬编码的 Docker 绝对路径在 Electron shell 环境中不可访问

**解决**: 使用 `'docker'` 命令名，让 shell 通过 PATH 环境变量自动解析

**修改文件**: `docker-manager.ts` (第 138-147 行)

```typescript
private async execDocker(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
        // 使用 'docker' 命令，让 shell 通过 PATH 环境变量解析
        const dockerProcess = spawn('docker', args, { shell: true });
        // ...
    });
}
```

**部署状态**: ✅ 已部署到 `.obsidian/plugins/obsidian-mcp/`

---

## 📝 现在需要您做什么

### 1️⃣ 重新加载插件（二选一）

**方法 A: 在 Obsidian 中重新加载**
1. 打开 Obsidian
2. Settings → Community plugins
3. 找到 "Obsidian MCP Manager"
4. **关闭** → 等待 2 秒 → **重新开启**

**方法 B: 重启 Obsidian**（更简单）
1. 完全关闭 Obsidian
2. 重新打开

### 2️⃣ 检查是否成功

打开开发者控制台 (`Ctrl+Shift+I` 或 `Cmd+Option+I`)

**✅ 成功标志**:
```
Starting container: obsidian-mcp-server
Container obsidian-mcp-server started successfully
```

**✅ 状态栏显示**: 🟢 "MCP: Running"

**❌ 如果仍有错误**: 复制错误信息，我们继续修复

### 3️⃣ 快速测试（3 分钟）

按 `Ctrl+P` (或 `Cmd+P`) 打开命令面板:

| 测试步骤 | 命令 | 预期结果 |
|---------|------|---------|
| **1. 启动容器** | `MCP: Start Container` | 控制台显示 "started successfully" |
| **2. 查看状态** | 状态栏点击 | 显示 🟢 "MCP: Running" |
| **3. 查看日志** | `MCP: View Logs` | 弹出日志查看窗口 |
| **4. 停止容器** | `MCP: Stop Container` | 控制台显示 "stopped successfully" |

---

## 🔍 环境验证（可选）

如果遇到问题，运行以下命令验证环境：

```bash
# 1. 验证 Docker 可用
docker --version

# 2. 验证 Docker 在 PATH 中
which docker

# 3. 验证环境变量
echo $PATH
```

预期结果：
- `docker --version` 应该显示版本号
- `which docker` 应该返回 Docker 路径（如 `/usr/bin/docker`）
- `echo $PATH` 应该包含 Docker 所在目录

---

## 📚 详细测试指南

完整测试步骤（8 项测试）请查看: [`TESTING-GUIDE.md`](./TESTING-GUIDE.md)

---

## 🆘 如果还有问题

请提供以下信息：

1. **错误信息**: 开发者控制台的完整错误（`Ctrl+Shift+I`）
2. **Docker 路径**: 运行 `which docker` 的结果
3. **容器状态**: 运行 `docker ps -a | grep obsidian-mcp-server` 的结果
4. **系统信息**: OS 类型和版本
5. **环境变量**: 运行 `echo $PATH` 的结果

---

## 📖 修复历史

- **Fix #1** (20:47): 使用绝对路径 → 仍然失败
- **Fix #2** (21:00): 添加 shell 模式 → 仍然失败
- **Fix #3** (Session 5): 使用 shell PATH 解析 → ✅ **当前部署**

详细修复过程请查看: [`README.md`](./README.md)

---

**插件版本**: 1.0.0
**当前修复**: Fix #3 (Shell PATH 解析)
**部署时间**: 2025-12-31 Session 5
**状态**: ✅ 已部署，等待测试验证

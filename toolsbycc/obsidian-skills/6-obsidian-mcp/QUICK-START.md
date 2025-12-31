# 🚀 快速开始 - Obsidian MCP Manager

## ✅ 修复完成

**问题**: 插件加载成功但启动失败
```
Failed to spawn docker process: spawn docker ENOENT
```

**原因**: Obsidian 的 Electron 环境 PATH 找不到 docker 命令

**解决**: 使用 Docker 完整路径
- Linux: `/usr/bin/docker`
- macOS: `/usr/local/bin/docker`

**修改文件**: `docker-manager.ts` (第 142-144 行)

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

### 3️⃣ 快速测试

按 `Ctrl+P` (或 `Cmd+P`) 打开命令面板:
- 输入 "MCP"
- 应该看到 4 个命令：Start、Stop、Restart、View Logs
- 尝试执行 "MCP: View Logs" 查看容器日志

---

## 📚 详细测试指南

完整测试步骤请查看: [`TESTING-GUIDE.md`](./TESTING-GUIDE.md)

---

## 🆘 如果还有问题

请提供以下信息：

1. **错误信息**: 开发者控制台的完整错误
2. **Docker 路径**: 运行 `which docker` 的结果
3. **容器状态**: 运行 `docker ps -a | grep obsidian-mcp-server` 的结果
4. **系统信息**: OS 类型和版本

---

**插件版本**: 1.0.0
**修复时间**: 2025-12-31 20:47
**状态**: ✅ 已部署，等待测试

# Obsidian MCP Manager - 测试指南

## 修复内容

✅ **已修复**: Docker ENOENT 错误
- **问题**: `spawn docker ENOENT` - Electron 环境找不到 docker 命令
- **原因**: Obsidian 的 Electron 环境 PATH 与终端不同
- **解决方案**: 使用 Docker 完整路径 `/usr/bin/docker` (Linux) 或 `/usr/local/bin/docker` (macOS)
- **修改文件**: `docker-manager.ts` (第 138-148 行)
- **部署时间**: 2025-12-31 20:47

## 测试前准备

### 1. 确认 Docker 容器存在

```bash
docker ps -a | grep obsidian-mcp-server
```

应该看到容器状态为 "Exited"（已停止状态）

### 2. 查看插件文件

```bash
ls -lh ~/.obsidian/plugins/obsidian-mcp/
```

应该看到:
- `main.js` (约 25K)
- `manifest.json`

## 测试步骤

### 第一步：重新加载插件

1. 打开 Obsidian
2. 打开设置 (Settings)
3. 进入 "社区插件" (Community plugins)
4. 找到 "Obsidian MCP Manager"
5. **关闭插件** (Toggle off)
6. 等待 2 秒
7. **重新开启插件** (Toggle on)

**或者直接重启 Obsidian**

### 第二步：检查启动状态

打开开发者控制台 (Ctrl+Shift+I 或 Cmd+Option+I)，查看 Console 标签:

#### ✅ 成功标志
```
Starting container: obsidian-mcp-server
Container obsidian-mcp-server started successfully
```

#### ❌ 如果仍有错误
检查错误信息:
- 如果还是 `ENOENT`：可能 Docker 路径不对，运行 `which docker` 查看实际路径
- 如果是 `permission denied`：需要将当前用户加入 docker 组
- 其他错误：复制完整错误信息

### 第三步：验证功能

#### 3.1 状态栏检查
右下角应该显示:
- 🟢 "MCP: Running" (容器运行中)
- 或 🔴 "MCP: Stopped" (容器已停止)

#### 3.2 命令面板测试
按 `Ctrl+P` (或 `Cmd+P`) 打开命令面板，搜索 "MCP":

应该看到 4 个命令:
1. "MCP: Start Container" - 启动容器
2. "MCP: Stop Container" - 停止容器
3. "MCP: Restart Container" - 重启容器
4. "MCP: View Logs" - 查看日志

**测试每个命令**:

1. **Stop Container** (如果正在运行)
   - 点击命令
   - 状态栏应变为 🔴 "MCP: Stopped"
   - 控制台显示: `Container obsidian-mcp-server stopped successfully`

2. **Start Container**
   - 点击命令
   - 状态栏应变为 🟢 "MCP: Running"
   - 控制台显示: `Container obsidian-mcp-server started successfully`

3. **Restart Container**
   - 点击命令
   - 状态栏应短暂显示停止，然后变为运行
   - 控制台显示停止和启动消息

4. **View Logs**
   - 点击命令
   - 应打开一个模态窗口显示容器日志
   - 可以滚动查看日志内容

#### 3.3 设置面板测试
1. 打开 Settings → Obsidian MCP Manager
2. 应该看到:
   - Container Name: obsidian-mcp-server
   - 可以修改容器名称

## 验证清单

请逐项确认:

- [ ] 插件成功加载，无 ENOENT 错误
- [ ] 状态栏显示容器状态
- [ ] Start 命令可以启动容器
- [ ] Stop 命令可以停止容器
- [ ] Restart 命令可以重启容器
- [ ] View Logs 可以显示日志
- [ ] 设置页面可以访问
- [ ] 状态栏点击可以快速启动/停止

## 常见问题排查

### Q1: 插件加载失败
**检查**:
```bash
cat /home/averypi/Documents/obs-averivendell/.obsidian/community-plugins.json
```
确保包含 `"obsidian-mcp"`

### Q2: Docker 命令失败
**检查 Docker 路径**:
```bash
which docker
```

如果路径不是 `/usr/bin/docker`，需要修改 `docker-manager.ts` 第 142-144 行

### Q3: 权限错误
**解决方案**:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Q4: 容器不存在
**创建测试容器**:
```bash
docker run -d --name obsidian-mcp-server alpine:latest sleep infinity
```

## 测试完成后

请报告:
1. ✅ 哪些功能正常工作
2. ❌ 哪些功能有问题
3. 📋 控制台的任何错误信息
4. 💡 使用体验和改进建议

## 下一步

测试通过后，我们将:
1. 编写完整的 README.md 文档
2. 添加更多功能（如容器配置）
3. 优化 UI 和用户体验
4. 准备发布

---

**测试环境**:
- OS: Linux (Raspberry Pi)
- Docker 路径: `/usr/bin/docker`
- Obsidian 版本: 1.0.5+
- 插件版本: 1.0.0

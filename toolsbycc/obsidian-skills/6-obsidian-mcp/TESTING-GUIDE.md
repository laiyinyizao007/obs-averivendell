# Obsidian MCP Manager - 完整测试指南

**版本**: 1.0.0
**最后更新**: 2025-12-31 Session 5
**修复状态**: Fix #3 已部署（Shell PATH 解析）

---

## 🔧 修复历史与当前状态

### Fix #3 - Shell PATH 解析 (当前部署)

**问题**: 硬编码的 Docker 绝对路径在 Electron shell 环境中不可访问
**原因**: 虽然 shell 模式解决了动态链接问题，但绝对路径 `/usr/bin/docker` 在 shell 环境中仍然失败
**解决方案**: 使用 `'docker'` 命令名，让 shell 通过 PATH 环境变量自动解析
**修改文件**: `docker-manager.ts` 第 138-147 行
**部署时间**: 2025-12-31 Session 5

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

**关键原理**: Shell 模式提供完整系统环境包括 PATH 变量。使用命令名而非绝对路径让 shell 自然解析，更可移植且与终端行为一致。

---

## ✅ 前置条件检查

### 1. Docker 环境验证

```bash
# 验证 Docker 已安装
docker --version
# 预期输出：Docker version 20.x.x 或更高

# 验证 Docker 运行中
docker ps
# 预期输出：正常的容器列表（可以为空）

# 验证 Docker 在 PATH 中
which docker
# 预期输出：/usr/bin/docker 或 /usr/local/bin/docker

# 验证 PATH 环境变量
echo $PATH
# 预期输出：包含 Docker 所在目录的路径列表
```

### 2. 测试容器准备

```bash
# 创建测试容器（如果不存在）
docker run -d --name obsidian-mcp-server alpine:latest sleep infinity

# 验证容器存在
docker ps -a | grep obsidian-mcp-server
# 预期输出：显示容器信息，STATUS 可以是 "Up" 或 "Exited"

# 停止容器（为了测试启动功能）
docker stop obsidian-mcp-server

# 确认已停止
docker ps -a | grep obsidian-mcp-server
# 预期输出：STATUS 列显示 "Exited"
```

### 3. 插件部署验证

```bash
# 检查插件文件
ls -lh /home/averypi/Documents/obs-averivendell/.obsidian/plugins/obsidian-mcp/

# 应该看到:
# - main.js (约 25K)
# - manifest.json
# - styles.css

# 验证 main.js 包含 Fix #3 代码
grep -A 2 "spawn('docker'" /home/averypi/Documents/obs-averivendell/.obsidian/plugins/obsidian-mcp/main.js
# 预期输出：应该能找到 spawn('docker', args, { shell: true })
```

---

## 🧪 测试流程 (8 步完整测试)

### 第 1 步：重新加载插件

**目的**: 确保使用最新的 Fix #3 代码

**执行步骤**:
1. 打开 Obsidian
2. 按 `Ctrl+Shift+I` (或 `Cmd+Option+I`) 打开开发者控制台
3. 切换到 **Console** 标签
4. 清空控制台日志（可选，便于查看新日志）
5. Settings → Community plugins → 找到 "Obsidian MCP Manager"
6. **关闭插件** (Toggle off) → 等待 2 秒 → **重新开启** (Toggle on)

**或直接重启 Obsidian**

**成功指标**:
- ✅ **控制台日志**: 无 `ENOENT` 错误
- ✅ **插件列表**: 显示 "Obsidian MCP Manager" 已启用
- ✅ **状态栏**: 右下角出现 "MCP: ..." 状态

---

### 第 2 步：测试 Start 命令

**目的**: 验证容器启动功能（Fix #3 核心修复）

**执行步骤**:
1. 确保容器当前是停止状态（状态栏显示 🔴 "MCP: Stopped"）
2. 打开命令面板：`Ctrl+P` (或 `Cmd+P`)
3. 输入：`MCP: Start Container`
4. 按 Enter

**成功指标**:
- ✅ **控制台日志**:
  ```
  Starting container: obsidian-mcp-server
  Container obsidian-mcp-server started successfully
  ```
- ✅ **状态栏**（右下角）: 显示 "🟢 MCP: Running"
- ✅ **终端验证**:
  ```bash
  docker ps | grep obsidian-mcp-server
  # STATUS 列显示 "Up X seconds"
  ```

**失败诊断**:
- ❌ 如果控制台显示 `spawn docker ENOENT` → Fix #3 未正确部署
- ❌ 如果显示 `/bin/sh: line 1: docker: not found` → shell PATH 中无 docker
- ❌ 如果显示 `permission denied` → 需要将用户加入 docker 组

---

### 第 3 步：测试 Stop 命令

**目的**: 验证容器停止功能

**执行步骤**:
1. 确保容器当前是运行状态（状态栏显示 🟢 "MCP: Running"）
2. 打开命令面板：`Ctrl+P`
3. 输入：`MCP: Stop Container`
4. 按 Enter

**成功指标**:
- ✅ **控制台日志**:
  ```
  Stopping container: obsidian-mcp-server
  Container obsidian-mcp-server stopped successfully
  ```
- ✅ **状态栏**: 显示 "🔴 MCP: Stopped"
- ✅ **终端验证**:
  ```bash
  docker ps -a | grep obsidian-mcp-server
  # STATUS 列显示 "Exited"
  ```

---

### 第 4 步：测试 Restart 命令

**目的**: 验证容器重启功能（先停后启，中间等待 1 秒）

**执行步骤**:
1. 确保容器当前是运行状态
2. 打开命令面板：`Ctrl+P`
3. 输入：`MCP: Restart Container`
4. 按 Enter

**成功指标**:
- ✅ **控制台日志**:
  ```
  Restarting container: obsidian-mcp-server
  Stopping container: obsidian-mcp-server
  Container obsidian-mcp-server stopped successfully
  Starting container: obsidian-mcp-server
  Container obsidian-mcp-server started successfully
  ```
- ✅ **状态栏**: 短暂显示停止状态，然后变为 "🟢 MCP: Running"
- ✅ **时序验证**: 从停止到启动之间应有约 1 秒延迟

---

### 第 5 步：测试 View Logs 命令

**目的**: 验证日志查看功能

**执行步骤**:
1. 确保容器正在运行
2. 打开命令面板：`Ctrl+P`
3. 输入：`MCP: View Logs`
4. 按 Enter

**成功指标**:
- ✅ **模态窗口**: 打开一个显示日志的弹窗
- ✅ **日志内容**: 显示最新 100 行日志
  - **注意**: Alpine 容器使用 `sleep infinity`，日志可能为空，这是正常的
  - 如果为空，窗口应显示 "(容器日志为空)"
- ✅ **可滚动**: 如果日志很多，可以滚动查看

**测试替代方案**（如果日志为空）:
```bash
# 临时运行一个会产生日志的容器
docker rm -f obsidian-mcp-server
docker run -d --name obsidian-mcp-server nginx:alpine
# 等待 5 秒，然后再执行 View Logs
```

---

### 第 6 步：测试状态栏点击

**目的**: 验证快速启动/停止功能

**执行步骤 A - 停止状态点击**:
1. 确保容器已停止（状态栏显示 🔴 "MCP: Stopped"）
2. 点击状态栏的 "MCP: Stopped" 文字
3. 观察行为

**成功指标**:
- ✅ **容器启动**: 与 Start 命令效果相同
- ✅ **状态栏更新**: 变为 "🟢 MCP: Running"

**执行步骤 B - 运行状态点击**:
1. 确保容器正在运行（状态栏显示 🟢 "MCP: Running"）
2. 点击状态栏的 "MCP: Running" 文字
3. 观察行为

**成功指标**:
- ✅ **容器停止**: 与 Stop 命令效果相同
- ✅ **状态栏更新**: 变为 "🔴 MCP: Stopped"

---

### 第 7 步：测试重试机制

**目的**: 验证启动失败时的 3 次自动重试（指数退避：2秒, 4秒, 8秒）

**执行步骤**:
1. 手动创建一个会失败的场景：
   ```bash
   # 删除测试容器
   docker rm -f obsidian-mcp-server
   ```

2. 在 Obsidian 中执行 Start 命令
3. 观察控制台日志

**成功指标**（失败重试机制正常工作）:
- ✅ **控制台日志**:
  ```
  Starting container: obsidian-mcp-server
  Start attempt 1/3 failed: Error: ...
  Retrying in 2000ms...
  Start attempt 2/3 failed: Error: ...
  Retrying in 4000ms...
  Start attempt 3/3 failed: Error: ...
  Failed to start container after 3 attempts: ...
  ```
- ✅ **状态栏**: 最终显示 "🔴 MCP: Error" 或 "Unknown"
- ✅ **时间间隔**: 第 1 次重试约 2 秒后，第 2 次约 4 秒后

**恢复测试环境**:
```bash
# 重新创建测试容器
docker run -d --name obsidian-mcp-server alpine:latest sleep infinity
```

---

### 第 8 步：测试状态缓存

**目的**: 验证 5 秒缓存机制（避免频繁调用 `docker ps`）

**执行步骤**:
1. 打开开发者控制台
2. 快速连续多次点击状态栏（每次间隔 < 1 秒）
3. 观察控制台日志

**成功指标**:
- ✅ **第 1 次点击**: 执行 `docker ps` 并切换状态
- ✅ **5 秒内后续点击**: 不执行 `docker ps`，直接使用缓存状态
- ✅ **5 秒后点击**: 重新执行 `docker ps` 获取最新状态

**验证方法**:
- 查看控制台日志中 Docker 命令执行频率
- 应该看到 5 秒内只执行一次 `docker ps`

---

## 🔍 错误诊断流程

### 诊断 Step 1: 检查控制台错误

**打开开发者控制台** (`Ctrl+Shift+I`)，查看 Console 标签。

**查找关键错误信息**:

| 错误信息 | 可能原因 | 诊断步骤 |
|---------|---------|---------|
| `spawn docker ENOENT` | Docker 命令未找到 | → 进入诊断 Step 2 |
| `No such file or directory` | 路径问题 | → 进入诊断 Step 3 |
| `permission denied` | 权限问题 | → 查看"权限错误"部分 |
| `Container does not exist` | 容器不存在 | → 查看"容器不存在"部分 |

---

### 诊断 Step 2: 验证 Docker 在 shell 环境中可访问

**在终端中运行**（模拟 shell 环境）:

```bash
# 测试 1: shell 模式下 Docker 命令
sh -c "docker --version"
# ✅ 成功：显示 Docker 版本
# ❌ 失败：显示 "docker: not found"

# 测试 2: 检查 shell 的 PATH
sh -c "echo \$PATH"
# 确认输出包含 /usr/bin 或 /usr/local/bin

# 测试 3: 验证 Docker 在 PATH 中
sh -c "which docker"
# ✅ 成功：显示 /usr/bin/docker 或 /usr/local/bin/docker
# ❌ 失败：无输出
```

**如果测试失败**:
1. Docker 可能未安装在标准位置
2. PATH 环境变量不包含 Docker 路径
3. 需要添加 Docker 路径到系统 PATH

---

### 诊断 Step 3: 验证部署的代码是否包含 Fix #3

```bash
# 检查 main.js 中的 Docker 调用代码
grep -A 5 "execDocker" /home/averypi/Documents/obs-averivendell/.obsidian/plugins/obsidian-mcp/main.js

# 应该能找到类似:
# spawn('docker', args, { shell: true })
#
# 而不是:
# spawn('/usr/bin/docker', args) 或 spawn(dockerPath, args)
```

**如果没找到正确代码**:
1. Fix #3 可能未正确部署
2. 需要重新编译：`npm run build`
3. 需要重新复制：`cp build/main.js .obsidian/plugins/obsidian-mcp/`

---

### 常见问题排查

#### 问题 1: 权限错误 (`permission denied`)

**原因**: 当前用户无权限执行 Docker 命令

**解决方案**:
```bash
# 将用户添加到 docker 组
sudo usermod -aG docker $USER

# 重新加载组权限
newgrp docker

# 验证
docker ps
```

#### 问题 2: 容器不存在 (`Container does not exist`)

**原因**: 测试容器未创建

**解决方案**:
```bash
# 创建测试容器
docker run -d --name obsidian-mcp-server alpine:latest sleep infinity

# 验证
docker ps -a | grep obsidian-mcp-server
```

#### 问题 3: Docker 未安装或未运行

**验证**:
```bash
docker --version
docker ps
```

**解决方案**: 安装并启动 Docker

---

## 📋 测试结果总结

请使用以下清单记录测试结果:

### 功能测试清单

- [ ] **Test 1**: 插件重新加载成功，无 ENOENT 错误
- [ ] **Test 2**: Start 命令可以启动容器
- [ ] **Test 3**: Stop 命令可以停止容器
- [ ] **Test 4**: Restart 命令可以重启容器
- [ ] **Test 5**: View Logs 可以显示日志
- [ ] **Test 6**: 状态栏点击可以快速启动/停止
- [ ] **Test 7**: 重试机制正常工作（3 次重试）
- [ ] **Test 8**: 状态缓存正常工作（5 秒缓存）

### 问题记录模板

如果任何测试失败，请记录:

```
测试编号: [1-8]
失败步骤: [详细描述]
控制台错误: [完整错误信息]
终端验证结果: [docker ps 输出]
系统环境:
  - OS: [Linux/macOS]
  - Docker 路径: [which docker 输出]
  - PATH 变量: [echo $PATH 输出]
```

---

## 🚀 下一步行动

### 如果所有测试通过 ✅

**恭喜！项目已成功完成。**

后续可选改进:
1. 添加更多容器配置选项
2. 支持多容器管理
3. 添加容器性能监控
4. 优化 UI 和用户体验

### 如果部分测试失败 ⚠️

**请报告给开发团队:**
1. 使用上述问题记录模板
2. 提供完整的控制台日志
3. 附上系统环境信息

### 如果发现新错误 (Error #4) ❌

**请收集以下信息**:
```bash
# 环境信息
uname -a
docker --version
which docker
echo $PATH

# 插件信息
ls -lh /home/averypi/Documents/obs-averivendell/.obsidian/plugins/obsidian-mcp/
cat /home/averypi/Documents/obs-averivendell/.obsidian/plugins/obsidian-mcp/manifest.json

# 容器信息
docker ps -a | grep obsidian-mcp-server

# 日志（如果容器存在）
docker logs obsidian-mcp-server
```

---

**测试指南版本**: 1.0.0
**对应修复**: Fix #3 (Shell PATH 解析)
**最后更新**: 2025-12-31 Session 5
**状态**: ✅ 准备就绪，等待用户测试

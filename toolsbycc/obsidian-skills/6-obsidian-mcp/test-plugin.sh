#!/bin/bash
# Obsidian MCP Plugin 功能测试脚本

CONTAINER_NAME="obsidian-mcp-server"
PLUGIN_DIR=".obsidian/plugins/obsidian-mcp"

echo "=========================================="
echo "Obsidian MCP Plugin 测试"
echo "=========================================="
echo ""

# 1. 检查插件文件
echo "[1/8] 检查插件文件..."
if [ -f "$PLUGIN_DIR/main.js" ] && [ -f "$PLUGIN_DIR/manifest.json" ]; then
    echo "✅ 插件文件存在"
    echo "   - main.js: $(wc -c < $PLUGIN_DIR/main.js) bytes"
    echo "   - manifest.json: $(wc -c < $PLUGIN_DIR/manifest.json) bytes"
else
    echo "❌ 插件文件缺失"
    exit 1
fi
echo ""

# 2. 检查容器存在性
echo "[2/8] 检查容器存在性..."
if docker inspect "$CONTAINER_NAME" &>/dev/null; then
    echo "✅ 容器存在: $CONTAINER_NAME"
else
    echo "❌ 容器不存在: $CONTAINER_NAME"
    exit 1
fi
echo ""

# 3. 测试获取容器状态（模拟 getStatus）
echo "[3/8] 测试获取容器状态..."
STATUS=$(docker inspect -f '{{.State.Status}}' "$CONTAINER_NAME" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ 状态获取成功: $STATUS"
else
    echo "❌ 状态获取失败"
    exit 1
fi
echo ""

# 4. 测试启动容器（模拟 start）
echo "[4/8] 测试启动容器..."
if docker start "$CONTAINER_NAME" &>/dev/null; then
    echo "✅ 容器启动成功"
    sleep 2
else
    echo "❌ 容器启动失败"
    exit 1
fi
echo ""

# 5. 验证容器运行状态
echo "[5/8] 验证容器运行状态..."
STATUS=$(docker inspect -f '{{.State.Status}}' "$CONTAINER_NAME" 2>/dev/null)
if [ "$STATUS" = "running" ]; then
    echo "✅ 容器正在运行"
else
    echo "❌ 容器未运行，当前状态: $STATUS"
    exit 1
fi
echo ""

# 6. 测试获取日志（模拟 getLogs）
echo "[6/8] 测试获取日志..."
LOGS=$(docker logs "$CONTAINER_NAME" 2>&1)
if [ $? -eq 0 ]; then
    echo "✅ 日志获取成功"
    echo "   日志行数: $(echo "$LOGS" | wc -l)"
else
    echo "❌ 日志获取失败"
fi
echo ""

# 7. 测试重启容器（模拟 restart）
echo "[7/8] 测试重启容器..."
if docker restart "$CONTAINER_NAME" &>/dev/null; then
    echo "✅ 容器重启成功"
    sleep 2
else
    echo "❌ 容器重启失败"
    exit 1
fi
echo ""

# 8. 测试停止容器（模拟 stop）
echo "[8/8] 测试停止容器..."
if docker stop "$CONTAINER_NAME" &>/dev/null; then
    echo "✅ 容器停止成功"
else
    echo "❌ 容器停止失败"
    exit 1
fi
echo ""

# 验证最终状态
FINAL_STATUS=$(docker inspect -f '{{.State.Status}}' "$CONTAINER_NAME" 2>/dev/null)
echo "=========================================="
echo "测试完成"
echo "=========================================="
echo "最终容器状态: $FINAL_STATUS"
echo ""
echo "✅ 所有核心功能测试通过！"
echo ""
echo "下一步操作："
echo "1. 在 Obsidian 中启用插件："
echo "   Settings → Community plugins → 启用 'Obsidian MCP Manager'"
echo ""
echo "2. 插件功能："
echo "   - 自动启动：Obsidian 启动时自动启动容器"
echo "   - 状态栏：显示容器状态（🟢运行/🔴停止/🟡启动中）"
echo "   - 右键菜单：重启、停止、查看日志"
echo "   - 命令面板：'View MCP Server Logs' 命令"
echo ""

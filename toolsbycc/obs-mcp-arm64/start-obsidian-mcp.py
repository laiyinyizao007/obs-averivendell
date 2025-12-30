#!/usr/bin/env python3
"""
Obsidian MCP Server Wrapper
修复 fastmcp 兼容性问题的包装器
"""

import os
import sys
import asyncio

# 设置 Python 路径
current_dir = os.path.dirname(os.path.abspath(__file__))
package_dir = os.path.join(current_dir, 'mcp-env/lib/python3.13/site-packages')
sys.path.insert(0, package_dir)

# 设置环境变量
os.environ['OBSIDIAN_VAULT_PATH'] = '/home/averypi/Documents/obs-averivendell'

def patch_fastmcp():
    """临时修复 fastmcp Image 导入问题"""
    try:
        import fastmcp
        # 如果 Image 不存在，创建一个简单的替代
        if not hasattr(fastmcp, 'Image'):
            class ImageStub:
                def __init__(self, *args, **kwargs):
                    pass
            fastmcp.Image = ImageStub
            print("FastMCP Image class patched successfully")
        return True
    except Exception as e:
        print(f"Failed to patch fastmcp: {e}")
        return False

async def start_server():
    """启动 Obsidian MCP 服务器"""
    try:
        # 尝试修复 fastmcp
        if not patch_fastmcp():
            print("Warning: fastmcp patching failed")

        # 尝试导入并启动服务器
        from obsidian_mcp.server import app
        print("Obsidian MCP Server starting...")

        # 这里应该启动 MCP 服务器
        # 具体的启动逻辑可能需要根据实际的 API 调整
        print("Server would start here (implementation needed)")

    except Exception as e:
        print(f"Error starting server: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("Obsidian MCP Server Wrapper")
    print(f"Vault path: {os.environ.get('OBSIDIAN_VAULT_PATH')}")

    # 运行服务器
    asyncio.run(start_server())
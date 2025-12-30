#!/usr/bin/env python3
"""
Obsidian MCP Server 启动脚本
修复 fastmcp 兼容性问题
"""

import os
import sys
import asyncio
import logging

# 添加包路径
current_dir = os.path.dirname(os.path.abspath(__file__))
package_dir = os.path.join(current_dir, 'mcp-env/lib/python3.13/site-packages')
sys.path.insert(0, package_dir)

# 设置环境变量
os.environ['OBSIDIAN_VAULT_PATH'] = '/home/averypi/Documents/obs-averivendell'

# 配置日志
logging.basicConfig(
    level=os.getenv("OBSIDIAN_LOG_LEVEL", "INFO"),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def patch_fastmcp():
    """修复 fastmcp Image 导入问题"""
    try:
        import fastmcp
        if not hasattr(fastmcp, 'Image'):
            # 创建一个简单的 Image 类替代
            class ImageStub:
                def __init__(self, *args, **kwargs):
                    self.data = args[0] if args else None
                    self.content_type = kwargs.get('content_type', 'image/png')

                def __repr__(self):
                    return f"ImageStub(content_type={self.content_type})"

            fastmcp.Image = ImageStub
            logger.info("FastMCP Image class patched successfully")

        return True
    except Exception as e:
        logger.error(f"Failed to patch fastmcp: {e}")
        return False

def main():
    """启动 Obsidian MCP 服务器"""
    try:
        logger.info(f"Starting Obsidian MCP Server")
        logger.info(f"Vault path: {os.environ.get('OBSIDIAN_VAULT_PATH')}")

        # 应用 fastmcp 补丁
        if not patch_fastmcp():
            logger.warning("FastMCP patching failed, continuing anyway...")

        # 导入并运行服务器
        from obsidian_mcp.server import main as server_main
        server_main()

    except ImportError as e:
        logger.error(f"Import error: {e}")
        # 如果还是有问题，尝试直接运行模块
        logger.info("Trying alternative startup method...")
        os.system(f"cd {current_dir} && {sys.executable} -m obsidian_mcp.server")

    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
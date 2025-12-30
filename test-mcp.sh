#!/bin/bash

# Simple script to test MCP server connectivity
VAULT_PATH="/home/averypi/Documents/obs-averivendell"
PYTHON_ENV="$VAULT_PATH/mcp-env/bin/python3"

echo "Testing MCP Server for Obsidian"
echo "Vault path: $VAULT_PATH"
echo "Python env: $PYTHON_ENV"

# Check if vault exists
if [ ! -d "$VAULT_PATH" ]; then
    echo "Error: Vault path does not exist"
    exit 1
fi

# Check if Python environment exists
if [ ! -f "$PYTHON_ENV" ]; then
    echo "Error: Python environment does not exist"
    exit 1
fi

echo "Environment check passed!"

# Try to run the server (this will likely fail due to the import issue, but let's document it)
echo "Attempting to start MCP server..."
cd "$VAULT_PATH"
$PYTHON_ENV -c "
import sys
sys.path.insert(0, 'mcp-env/lib/python3.13/site-packages')
try:
    from obsidian_mcp import server
    print('Import successful!')
except ImportError as e:
    print(f'Import failed: {e}')
    print('This is expected due to fastmcp version compatibility')
"
#!/bin/bash

# MCP Server Environment Configuration for Obsidian
export OBSIDIAN_API_KEY="f8df28d32e3777885a5318ff1cb6695355c2ee3e8fa5ae7f516d95aaf550a41a"
export OBSIDIAN_API_URL="https://localhost:27124"
export VAULT_PATH="/home/averypi/Documents/obs-averivendell"

# Test the MCP server
echo "Testing MCP Obsidian Server..."
echo "API URL: $OBSIDIAN_API_URL"
echo "Vault: $VAULT_PATH"

cd "$VAULT_PATH"
./toolsbycc/obs-mcp-arm64/mcp-env/bin/mcp-obsidian --help
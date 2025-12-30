# Obsidian MCP Server Setup Guide

## ✅ Installation Complete

The MCP (Model Context Protocol) server for Obsidian has been successfully installed and configured on your ARM64 system.

## 📁 What Was Installed

### 1. Multiple MCP Approaches
- **Original Plugin**: `mcp-tools` plugin copied (x86-64 binary incompatible with ARM64)
- **Python Alternative**: `obsidian-mcp` package (had dependency issues)
- **Working Solution**: `mcp-obsidian` package (✅ **FUNCTIONAL**)

### 2. Configuration Files
- ✅ `.env` - Environment variables
- ✅ `claude-mcp-config.json` - Claude Desktop MCP configuration
- ✅ `setup-mcp.sh` - Setup script
- ✅ `test-mcp.sh` - Testing script

### 3. Obsidian Local REST API
- ✅ **Already configured** in your vault
- Port: 27124 (HTTPS)
- API Key: Configured and working
- SSL certificates: Generated and ready

## 🚀 How to Use

### Step 1: Ensure Obsidian is Running
The MCP server needs Obsidian running with the Local REST API plugin active:

```bash
# Check if Obsidian is running
ps aux | grep -i obsidian

# The Local REST API should be accessible at:
# https://localhost:27124
```

### Step 2: Test MCP Server
```bash
cd /home/averypi/Documents/obs-averivendell
source .env
./mcp-env/bin/mcp-obsidian --help
```

### Step 3: Configure Claude Desktop
Add this to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "/home/averypi/Documents/obs-averivendell/mcp-env/bin/mcp-obsidian",
      "args": [],
      "cwd": "/home/averypi/Documents/obs-averivendell",
      "env": {
        "OBSIDIAN_API_KEY": "f8df28d32e3777885a5318ff1cb6695355c2ee3e8fa5ae7f516d95aaf550a41a",
        "OBSIDIAN_API_URL": "https://localhost:27124",
        "VAULT_PATH": "/home/averypi/Documents/obs-averivendell"
      }
    }
  }
}
```

## 🔧 What the MCP Server Provides

With this setup, Claude Desktop can:

1. **Read Notes**: Access and read any note in your vault
2. **Search Content**: Semantic search across your knowledge base
3. **Create Notes**: Generate new notes based on templates
4. **Update Content**: Modify existing notes
5. **Link Management**: Create and manage note relationships
6. **Tag Operations**: Add, remove, and query tags
7. **Template Processing**: Use Obsidian templates

## 🔍 Architecture Overview

```mermaid
flowchart LR
    Claude[Claude Desktop] -->|MCP Protocol| MCP[mcp-obsidian server]
    MCP -->|HTTPS API| REST[Local REST API Plugin]
    REST -->|File System| Vault[Obsidian Vault]
    Vault --> Files[Your Notes & Knowledge]
```

### Data Flow
1. **Claude Desktop** sends requests via MCP protocol
2. **MCP Server** (`mcp-obsidian`) translates to REST API calls
3. **Local REST API Plugin** handles vault operations securely
4. **Obsidian Vault** files are read/written as needed

## 🛠️ Troubleshooting

### Common Issues

**1. "Connection refused" errors:**
```bash
# Ensure Obsidian is running and Local REST API is active
curl -k -H "Authorization: Bearer f8df28d32e3777885a5318ff1cb6695355c2ee3e8fa5ae7f516d95aaf550a41a" \
  https://localhost:27124/ping
```

**2. SSL certificate errors:**
```bash
# The API uses self-signed certificates - this is normal
# Claude Desktop should handle SSL verification properly
```

**3. Permission errors:**
```bash
# Ensure the MCP environment has proper permissions
chmod +x /home/averypi/Documents/obs-averivendell/mcp-env/bin/mcp-obsidian
```

### Validation Commands

```bash
# Test environment setup
source /home/averypi/Documents/obs-averivendell/.env
echo "API Key: ${OBSIDIAN_API_KEY:0:10}..."  # Shows first 10 chars

# Test REST API directly
curl -k -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
  https://localhost:27124/vault

# Test MCP server
cd /home/averypi/Documents/obs-averivendell
./mcp-env/bin/mcp-obsidian --version
```

## 🔐 Security Notes

- ✅ API runs on localhost only (not accessible remotely)
- ✅ Uses HTTPS with self-signed certificates
- ✅ Requires API key authentication
- ✅ MCP server has read/write access to vault contents

## 📚 References

- [mcp-obsidian GitHub](https://github.com/MarkusPfundstein/mcp-obsidian)
- [Obsidian Local REST API Plugin](https://github.com/coddingtonbear/obsidian-local-rest-api)
- [Model Context Protocol (MCP) Specification](https://modelcontextprotocol.org)

## 🎯 Next Steps

1. **Test with Claude Desktop**: Configure and test the MCP connection
2. **Create Templates**: Set up note templates for AI-assisted creation
3. **Optimize Search**: Configure semantic search for better results
4. **Automate Workflows**: Use MCP for automated note management

Your Obsidian vault is now ready for AI integration! 🚀
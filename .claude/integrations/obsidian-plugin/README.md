# Claude Code Integration Plugin for Obsidian

## Overview

This integration provides a native Obsidian plugin that connects to Claude Code CLI, enabling AI-assisted note editing, analysis, and automation directly within Obsidian.

## Installation

### Plugin Location
```
.obsidian/plugins/claude-code-integration/
├── main.js          (201KB)
├── manifest.json
└── styles.css       (33KB)
```

### Source
- **Project**: obsidian-skills/5-ai-plugin
- **Version**: 1.0.11
- **Author**: David Alcalá
- **Plugin ID**: claude-code-integration

## Configuration

### Claude Code CLI Path
```
CLI Path: /usr/bin/claude
```

Verify CLI installation:
```bash
which claude
# Should output: /usr/bin/claude
```

### Layer 3 Settings
Location: `.claude/config/settings.json`

```json
{
  "layer3": {
    "enabled": true,
    "features": {
      "cliPlugin": {
        "enabled": true,
        "cliPath": "/usr/bin/claude",
        "pluginId": "claude-code-integration",
        "pluginVersion": "1.0.11"
      }
    }
  }
}
```

## Features

### 🤖 AI-Powered Note Editing
- Direct Claude Code integration in Obsidian
- Context-aware (understands note content and vault structure)
- Streaming responses in real-time
- File modifications with permission control

### 📊 Rich UI Experience
- Real-time streaming responses
- Visual todo list showing Claude's plan and progress
- Preview changes before applying
- Session history and resumption
- Activity monitoring (see which tools Claude is using)

### 🎛️ Flexible Control
- **Permission Modes**:
  - Interactive Mode: Claude asks before making changes
  - Permissionless Mode: Autonomous operation for trusted tasks
- **Model Selection**: Choose between Sonnet, Opus, Haiku
- **Vault Access**: Optional full vault read/write
- **Custom System Prompts**: Configure Claude's behavior

### 🔧 Advanced Capabilities
- Tool usage (Bash, file operations, web search, etc.)
- Session resumption across plugin restarts
- Selected text editing
- Auto-apply changes option
- Beautiful markdown rendering

## Usage

### Enabling the Plugin in Obsidian

1. Open Obsidian Settings
2. Navigate to: Settings → Community Plugins
3. Disable "Safe Mode" if enabled
4. Click "Installed Plugins"
5. Find "Claude Code Integration"
6. Toggle to enable

### Opening Claude Code View

**Method 1: Command Palette**
- Press `Ctrl+P` (or `Cmd+P` on Mac)
- Type "Claude Code"
- Select "Open Claude Code view"

**Method 2: Ribbon Icon**
- Look for Claude icon in left sidebar
- Click to open view

**Method 3: Keyboard Shortcut**
- Default: `Ctrl+Shift+C` (can be customized)

### Plugin Settings

Navigate to: Settings → Plugin Options → Claude Code Integration

**Basic Settings**:
- **CLI Path**: `/usr/bin/claude` (auto-detected)
- **Model**: claude-sonnet-4-20250514 (default)
- **Session Timeout**: 30 minutes
- **Chat Position**: Right sidebar (default)

**Permission Settings**:
- **Interactive Mode**: Enabled (Claude asks before changes)
- **Vault Access**: Restricted to current note (default)
- **Auto-apply Changes**: Disabled (default)

**Advanced Settings**:
- **Custom System Prompt**: Optional
- **Tool Permissions**: Configure which tools Claude can use
- **Session Storage**: `.obsidian/plugins/claude-code-integration/sessions/`

## Integration with PARA Method

The plugin respects your PARA folder structure:

### File Access Patterns

**Default (Safe Mode)**:
- Read: Current note only
- Write: Current note only (with confirmation)

**Vault Access Enabled**:
- Read: All markdown files in vault
- Write: Restricted by Layer 2 PKM permissions:
  - `00_Inbox/*` - Allowed
  - `06_Metadata/*` - Allowed
  - Other folders - Requires confirmation

### Workflow Examples

**Example 1: Process Inbox Notes**
```
User: Process all notes in 00_Inbox and categorize them

Claude (with vault access):
1. Reads all .md files in 00_Inbox
2. Analyzes content and suggests categories
3. Asks permission to move files to appropriate PARA folders
4. Updates metadata and creates links
```

**Example 2: Goal Tracking Update**
```
User: Update my weekly goals in 06_Metadata/goal-tracker/

Claude:
1. Reads current weekly goals file
2. Reads recent daily notes for progress
3. Calculates completion percentages
4. Asks permission to update goal status
5. Writes updated goals file
```

**Example 3: Weekly Review**
```
User: Help me with my weekly review

Claude:
1. Triggers /weekly command (from PKM System)
2. Collects data from:
   - Daily notes from past week
   - Projects folder updates
   - Completed tasks
3. Generates review summary
4. Asks permission to save to 06_Metadata/weekly-review/
```

## Integration with PKM System (Layer 2)

The CLI Plugin works seamlessly with PKM System skills, commands, and agents:

### Skill Auto-Loading

When you chat with Claude in Obsidian, these skills are automatically available:

- **goal-tracking** - When discussing goals or progress
- **daily-workflow** - When working on daily notes
- **obsidian-vault-ops** - When performing vault operations

### Command Execution

You can trigger PKM commands directly in Claude chat:

```
User: /weekly
Claude: [Executes weekly review workflow]

User: /daily
Claude: [Starts daily reflection]

User: /onboard
Claude: [Guides through vault setup]
```

### Agent Activation

PKM agents can be invoked from Claude chat:

```
User: Organize my notes in the inbox

Claude: [Activates inbox-processor agent]
- Scans 00_Inbox
- Suggests categories
- Proposes file moves
- Updates metadata
```

## Troubleshooting

### Plugin Not Loading

**Check Installation**:
```bash
ls -la /home/averypi/Documents/obs-averivendell/.obsidian/plugins/claude-code-integration/
# Should show: main.js, manifest.json, styles.css
```

**Check Obsidian Logs**:
- Open Developer Tools: `Ctrl+Shift+I`
- Check Console tab for errors

### Claude CLI Not Found

**Verify CLI Path**:
```bash
which claude
# Should output: /usr/bin/claude

claude --version
# Should output version info
```

**Update Plugin Settings**:
- Settings → Claude Code Integration
- Update "CLI Path" to `/usr/bin/claude`

### API Key Issues

**Check API Key**:
```bash
echo $ANTHROPIC_API_KEY
# Should output your API key
```

**Set API Key** (if missing):
```bash
export ANTHROPIC_API_KEY='your-key-here'

# Add to shell config for persistence:
echo 'export ANTHROPIC_API_KEY="your-key-here"' >> ~/.zshrc
source ~/.zshrc
```

### Permission Errors

**File Access Denied**:
- Check Layer 2 PKM permissions in `.claude/config/settings.json`
- Ensure folders are in `fileWrite` whitelist: `["00_Inbox", "06_Metadata"]`

**Command Execution Blocked**:
- Check `commandExecution: true` in Layer 2 PKM permissions

### Session Issues

**Session History Lost**:
- Check session storage: `.obsidian/plugins/claude-code-integration/sessions/`
- Each note has a separate session file

**Session Timeout**:
- Default: 30 minutes of inactivity
- Adjust in plugin settings: "Session Timeout"

## Advanced Configuration

### Custom System Prompt

You can configure Claude's behavior with a custom system prompt:

**Location**: Plugin Settings → Advanced → Custom System Prompt

**Example**:
```
You are helping with Obsidian note management.
Always respect the PARA folder structure.
When moving files, maintain proper categorization.
Follow the file naming convention: YYYY-MM-DD-Context-Title.md
```

### Tool Permissions

Configure which tools Claude can use:

**Default (Safe)**:
- Read - Enabled
- Write - Ask first
- Bash - Disabled
- Web - Enabled (read-only)

**Advanced (Trusted)**:
- All tools - Enabled
- Auto-apply changes - Enabled
- Vault access - Full

### Keyboard Shortcuts

Customize in: Settings → Hotkeys → Claude Code Integration

**Default Shortcuts**:
- Open view: `Ctrl+Shift+C`
- New conversation: `Ctrl+Shift+N`
- Apply changes: `Ctrl+Shift+A`

## Security & Privacy

### Data Handling

- **Local Processing**: Plugin runs CLI locally
- **API Calls**: Only through Anthropic API
- **Session Data**: Stored locally in `.obsidian/plugins/`
- **No Telemetry**: Plugin doesn't send usage data

### API Key Security

- **Never Commit**: API key is in environment variable, not in vault
- **Git Ignore**: `.env` files are gitignored
- **Encrypted**: API communication uses HTTPS

### Permission Model

- **Minimum Privilege**: Start with restricted access
- **Explicit Consent**: Claude asks before file modifications
- **Audit Trail**: All changes logged in session history

## Updates & Maintenance

### Updating the Plugin

**Method 1: Rebuild from Source**
```bash
cd toolsbycc/obsidian-skills/5-ai-plugin
npm install
npm run build
cp build/* /home/averypi/Documents/obs-averivendell/.obsidian/plugins/claude-code-integration/
```

**Method 2: Check for Updates**
- Settings → Community Plugins → Check for updates
- (When plugin is published to community plugins)

### Backup Before Update

Always backup plugin data before updating:
```bash
cp -r .obsidian/plugins/claude-code-integration/ .obsidian/plugins/claude-code-integration.backup
```

## Related Documentation

- **Plugin Dev Skill**: `.claude/skills/plugin-dev/SKILL.md`
- **PKM System**: `.claude/skills/pkm/`
- **Layer Configuration**: `.claude/config/settings.json`
- **Original Project**: `toolsbycc/obsidian-skills/5-ai-plugin/README.md`

## Support

- **Plugin Issues**: https://github.com/deivid11/obsidian-claude-code-plugin/issues
- **Claude Code CLI**: https://docs.anthropic.com/claude/docs/claude-code
- **Obsidian API**: https://docs.obsidian.md/

---

**Version**: 1.0.11
**Last Updated**: 2025-12-30
**Integration Status**: ✅ Active (Layer 3 Enabled)

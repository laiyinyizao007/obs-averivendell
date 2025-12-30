# Obsidian Skills Integration Guide

**Version**: 2.0.0
**Last Updated**: 2025-12-30
**Integration Status**: ✅ Complete

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Feature Comparison](#feature-comparison)
6. [Usage Guide](#usage-guide)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance](#maintenance)

---

## Overview

This integration combines 5 high-quality Obsidian skills from GitHub into a unified system:

| Project | Layer | Purpose | Status |
|---------|-------|---------|--------|
| **Plugin Dev Skill** | Layer 1 | Foundation - Obsidian plugin development guidelines | ✅ Integrated |
| **PKM System** | Layer 2 | Automation - Goal tracking & workflow automation | ✅ Integrated |
| **Second Brain** | Layer 2 | Intelligence - Self-evolving knowledge system | ✅ Integrated |
| **MCP Server** | Layer 3 | Integration - MCP server for external tools | ⏸️ Deferred |
| **CLI Plugin** | Layer 3 | Integration - Obsidian UI for Claude Code | ✅ Integrated |

### What You Get

**Immediately Available**:
- ✅ **27 ESLint Rules** - Professional Obsidian plugin development standards
- ✅ **3-Tier Goal Tracking** - 3-year → yearly → monthly → weekly → daily hierarchy
- ✅ **4 Automation Commands** - `/daily`, `/weekly`, `/onboard`, `/push`
- ✅ **4 AI Agents** - Goal alignment, inbox processing, note organization, weekly review
- ✅ **Obsidian Plugin** - Claude Code UI integration directly in Obsidian

**Available When Enabled**:
- ⏸️ **Second Brain** - 6 auto-activating skills for self-evolving knowledge
- ⏸️ **MCP Server** - External tool integration via Model Context Protocol

---

## Architecture

### Three-Layer Design

```
Layer 3: Advanced Integrations (可选)
├── CLI Plugin ✅ - Obsidian UI integration
└── MCP Server ⏸️ - External tool protocol

Layer 2: Automation & Intelligence (可选)
├── PKM System ✅ - Goal tracking & workflows
└── Second Brain ⏸️ - Self-evolving knowledge

Layer 1: Foundation (核心)
└── Plugin Dev Skill ✅ - Development standards
```

### Directory Structure

```
.claude/
├── skills/                 # Skills registry
│   ├── _index.json        # Central registration
│   ├── plugin-dev/        # Layer 1: Plugin development
│   ├── pkm/               # Layer 2: PKM system
│   └── second-brain/      # Layer 2: Self-evolving (disabled)
├── commands/              # Command automation
│   ├── _index.json        # Command registration
│   └── pkm/               # PKM commands (4)
├── agents/                # AI agents
│   ├── _index.json        # Agent registration
│   └── pkm/               # PKM agents (4)
├── config/                # Configuration center
│   ├── settings.json      # Master settings
│   └── features.json      # Feature toggles
├── integrations/          # Layer 3 integrations
│   ├── obsidian-plugin/   # CLI Plugin (enabled)
│   └── mcp-server/        # MCP Server (disabled)
├── scripts/               # Installation & health check
│   ├── install.cjs        # Installation wizard
│   └── doctor.cjs         # Health check tool
└── docs/                  # Documentation
    └── INTEGRATION_GUIDE.md  # This file
```

---

## Installation

### Quick Start

**1. Clone the integrated vault** (Already done if reading this file)

**2. Run health check**:
```bash
cd /home/averypi/Documents/obs-averivendell
node .claude/scripts/doctor.cjs
```

**3. Enable Obsidian plugin**:
- Open Obsidian
- Settings → Community Plugins
- Disable "Safe Mode"
- Click "Installed Plugins"
- Find "Claude Code Integration"
- Toggle to enable

### Manual Installation

If starting from scratch:

```bash
# 1. Run installation wizard
node .claude/scripts/install.cjs

# 2. Follow prompts to:
#    - Verify environment
#    - Create directories
#    - Initialize registries
#    - Configure settings

# 3. Run health check
node .claude/scripts/doctor.cjs
```

---

## Configuration

### Settings File Structure

**Location**: `.claude/config/settings.json`

```json
{
  "version": "2.0.0",
  "layers": {
    "layer1": {
      "enabled": true,
      "description": "Foundation - Plugin Dev Skill"
    },
    "layer2": {
      "enabled": true,
      "features": {
        "pkm": {
          "enabled": true,
          "permissions": {
            "fileRead": ["*"],
            "fileWrite": ["00_Inbox", "06_Metadata"],
            "commandExecution": true
          }
        },
        "secondBrain": {
          "enabled": false
        }
      }
    },
    "layer3": {
      "enabled": true,
      "features": {
        "mcpServer": {
          "enabled": false,
          "port": 22360
        },
        "cliPlugin": {
          "enabled": true,
          "cliPath": "/usr/bin/claude",
          "pluginId": "claude-code-integration",
          "pluginVersion": "1.0.11"
        }
      }
    }
  },
  "featureToggles": {
    "goalTracking": {
      "enabled": true,
      "strategy": "pkm"
    },
    "weeklyReview": {
      "enabled": true,
      "pipeline": ["pkm/collection"]
    }
  }
}
```

### Enabling/Disabling Features

**To Enable Second Brain**:
```json
"layer2": {
  "enabled": true,
  "features": {
    "secondBrain": {
      "enabled": true  // Change from false
    }
  }
}
```

**To Enable MCP Server**:
```json
"layer3": {
  "features": {
    "mcpServer": {
      "enabled": true,  // Change from false
      "port": 22360
    }
  }
}
```

**After changes**: Run health check to verify:
```bash
node .claude/scripts/doctor.cjs
```

---

## Feature Comparison

### Goal Tracking Strategies

| Feature | PKM Strategy (Current) | Second Brain Strategy (Enabled) |
|---------|------------------------|----------------------------------|
| **Approach** | Structured, explicit | AI-driven, implicit |
| **Input** | Manual entry | Automatic from notes |
| **Hierarchy** | 3-year → yearly → monthly → weekly → daily | Emergent from patterns |
| **Updates** | Weekly review workflow | Continuous auto-update |
| **Best For** | Job search, project management | Long-term knowledge work |

**Recommendation**: Start with PKM (enabled), add Second Brain later if needed.

### Weekly Review Options

| Mode | Pipeline | Description |
|------|----------|-------------|
| **PKM Only** | `["pkm/collection"]` | Structured Q&A workflow |
| **PKM + Second Brain** | `["pkm/collection", "second-brain/analysis"]` | Structured + AI insights |
| **Hybrid** | `["pkm/collection", "second-brain/analysis", "system-evolution"]` | Full pipeline with auto-skill updates |

**Current Configuration**: PKM Only (simplest, most predictable)

---

## Usage Guide

### Layer 1: Plugin Development

**Purpose**: When developing Obsidian plugins

**Auto-Activation**: Claude detects plugin development context

**Provides**:
- 27 ESLint rules for code quality
- Memory management best practices
- Type safety guidelines
- UI/UX standards
- File operation patterns
- Accessibility requirements

**Reference Files**:
- `memory-management.md` - Prevent leaks
- `type-safety.md` - TypeScript best practices
- `ui-ux.md` - User experience guidelines
- `file-operations.md` - Safe file handling
- `css-styling.md` - Styling standards
- `accessibility.md` - A11y requirements
- `code-quality.md` - Quality standards
- `submission.md` - Publication guidelines

### Layer 2: PKM System

#### Skills (Auto-Activate)

**1. Goal Tracking** (`goal-tracking/`)
- Triggers: When discussing goals or progress
- Hierarchy: 3-year → yearly → monthly → weekly → daily
- Files: `06_Metadata/goal-tracker/`

**2. Daily Workflow** (`daily-workflow/`)
- Triggers: Daily reflection, journaling
- Location: `00_Inbox/YYYY-MM-DD.md`

**3. Vault Operations** (`obsidian-vault-ops/`)
- Triggers: File management, vault organization
- Operations: Move, rename, archive, cleanup

#### Commands (Manual Trigger)

```bash
/daily      # Start daily reflection
/weekly     # Start weekly review
/onboard    # Vault setup wizard
/push       # Git commit & push automation
```

#### Agents (Background)

**1. Goal Aligner** (`goal-aligner.md`)
- Purpose: Align daily actions with long-term goals
- Triggers: Goal misalignment detection

**2. Inbox Processor** (`inbox-processor.md`)
- Purpose: Automatic inbox categorization
- Scans: `00_Inbox/` folder
- Suggests: PARA categorization

**3. Note Organizer** (`note-organizer.md`)
- Purpose: Maintain vault structure
- Checks: File naming, folder placement
- Fixes: Automatic corrections

**4. Weekly Reviewer** (`weekly-reviewer.md`)
- Purpose: Generate weekly insights
- Inputs: Daily notes, project progress
- Outputs: Weekly summary

### Layer 3: CLI Plugin

**See**: `.claude/integrations/obsidian-plugin/README.md`

**Quick Start**:
1. Open Obsidian
2. Press `Ctrl+P` → "Open Claude Code view"
3. Start chatting with Claude in Obsidian

**Features**:
- Real-time streaming responses
- Visual todo list
- Change preview
- Session history
- Tool usage monitoring

---

## Troubleshooting

### Health Check Errors

**Run diagnostics**:
```bash
node .claude/scripts/doctor.cjs
```

**Common Issues**:

#### 1. JSON Parse Errors
```
❌ .claude/commands/_index.json JSON 格式错误
```

**Fix**: Ensure proper JSON structure:
```json
{
  "version": "1.0.0",
  "registry": {}
}
```

#### 2. Missing Directories
```
❌ .claude/skills/ 目录不存在
```

**Fix**: Run installation wizard:
```bash
node .claude/scripts/install.cjs
```

#### 3. Permission Errors
```
❌ .claude/skills/ 读写权限异常
```

**Fix**: Correct permissions:
```bash
chmod -R 755 .claude/
chmod 644 .claude/**/*.json
chmod 644 .claude/**/*.md
```

#### 4. CLI Path Mismatch
```
❌ 配置路径不匹配: /usr/local/bin/claude vs /usr/bin/claude
```

**Fix**: Update settings.json:
```json
"cliPath": "/usr/bin/claude"  // Use correct path
```

#### 5. Plugin Not Loading
```
⚠️  Obsidian Plugin 未安装或版本不匹配
```

**Fix**: Reinstall plugin:
```bash
cd /home/averypi/Documents/obs-averivendell/toolsbycc/obsidian-skills/5-ai-plugin
npm run build
cp build/* /home/averypi/Documents/obs-averivendell/.obsidian/plugins/claude-code-integration/
```

### Health Check Warnings

#### Version Inconsistency
```
⚠️  配置文件版本不一致
```

**Impact**: Cosmetic only, doesn't affect functionality

**Fix** (optional): Standardize versions in all `_index.json` files

---

## Maintenance

### Weekly Checklist

**Every Sunday**:
```bash
# 1. Run health check
node .claude/scripts/doctor.cjs

# 2. Process goals (if using PKM)
/weekly

# 3. Check for updates (when available)
# (Currently manual - future: auto-update system)
```

### Monthly Review

**Check**:
- [ ] All enabled features still working
- [ ] No stale inbox items
- [ ] Goal tracking up to date
- [ ] Plugin version current

### Updating Components

**Plugin Dev Skill** (Layer 1):
```bash
# Pull latest from GitHub
cd /home/averypi/Documents/obs-averivendell/toolsbycc/obsidian-skills/1-plugin-dev
git pull

# Copy updated files
cp -r .claude/skills/obsidian/* /home/averypi/Documents/obs-averivendell/.claude/skills/plugin-dev/
```

**PKM System** (Layer 2):
```bash
# Pull latest
cd /home/averypi/Documents/obs-averivendell/toolsbycc/obsidian-skills/2-pkm-system
git pull

# Copy updated files
cp -r vault-template/.claude/skills/* /home/averypi/Documents/obs-averivendell/.claude/skills/pkm/
cp -r vault-template/.claude/commands/* /home/averypi/Documents/obs-averivendell/.claude/commands/pkm/
cp -r vault-template/.claude/agents/* /home/averypi/Documents/obs-averivendell/.claude/agents/pkm/
```

**CLI Plugin** (Layer 3):
```bash
# Pull latest
cd /home/averypi/Documents/obs-averivendell/toolsbycc/obsidian-skills/5-ai-plugin
git pull
npm install
npm run build

# Copy to Obsidian
cp build/* /home/averypi/Documents/obs-averivendell/.obsidian/plugins/claude-code-integration/
```

**After updates**: Run health check
```bash
node .claude/scripts/doctor.cjs
```

---

## Advanced Configuration

### Custom Goal Hierarchy

**Location**: `06_Metadata/goal-tracker/`

**Customize levels**:
```markdown
# 3-Year Goals (2025-2028)
- [ ] Land AI Product Manager role
- [ ] Build hardware project portfolio

# Yearly Goals (2025)
- [ ] Complete 3 major projects
- [ ] Network with 50 industry professionals

# Monthly Goals (January 2025)
- [ ] Submit 20 job applications
- [ ] Finish ESP32 prototype

# Weekly Goals (Week of 2025-12-30)
- [ ] Apply to 5 companies
- [ ] Complete circuit design

# Daily Goals (2025-12-30)
- [ ] Update resume
- [ ] Order components
```

### Permission Customization

**Restrict PKM write access**:
```json
"permissions": {
  "fileWrite": ["00_Inbox"]  // Only inbox, not metadata
}
```

**Expand to all folders**:
```json
"permissions": {
  "fileWrite": ["*"]  // Full vault access (use cautiously)
}
```

### Feature Toggle Examples

**Disable goal tracking**:
```json
"goalTracking": {
  "enabled": false
}
```

**Switch to hybrid review**:
```json
"weeklyReview": {
  "enabled": true,
  "pipeline": ["pkm/collection", "second-brain/analysis"]
}
```

---

## Related Documentation

- **Plugin Documentation**: `.claude/integrations/obsidian-plugin/README.md`
- **Main Vault Guide**: `CLAUDE.md`
- **PARA Method**: `.claude/rules/para-method-fundamentals.md`
- **File Naming**: `.claude/rules/file-naming-conventions.md`
- **Helper Scripts**: `.claude/rules/helper-scripts-reference.md`
- **Troubleshooting**: `.claude/rules/troubleshooting-guide.md`

---

## Support & Contributing

### Issues
- **Installation problems**: Check health check output
- **Plugin issues**: See `.claude/integrations/obsidian-plugin/README.md`
- **PKM workflow**: Check PKM system documentation

### Source Projects
1. **Plugin Dev Skill**: `toolsbycc/obsidian-skills/1-plugin-dev/`
2. **PKM System**: `toolsbycc/obsidian-skills/2-pkm-system/`
3. **Second Brain**: `toolsbycc/obsidian-skills/3-second-brain/`
4. **MCP Server**: `toolsbycc/obsidian-skills/4-mcp-server/`
5. **CLI Plugin**: `toolsbycc/obsidian-skills/5-ai-plugin/`

### Future Enhancements
- [ ] Auto-update system for components
- [ ] GUI configuration tool
- [ ] Additional language support
- [ ] Enhanced agent collaboration
- [ ] Custom skill development templates

---

**Version**: 2.0.0
**Status**: Production Ready
**Last Updated**: 2025-12-30

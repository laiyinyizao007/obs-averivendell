# Configuration Guide

**Version**: 2.0.0
**Last Updated**: 2025-12-30

---

## Configuration Files Overview

| File | Purpose | Edit Frequency |
|------|---------|----------------|
| `settings.json` | Master configuration | Rare (initial setup) |
| `features.json` | Feature toggles | Occasional (enable/disable) |
| `skills/_index.json` | Skills registry | Rare (add new skills) |
| `commands/_index.json` | Commands registry | Rare (add new commands) |
| `agents/_index.json` | Agents registry | Rare (add new agents) |

---

## Master Configuration (`settings.json`)

**Location**: `.claude/config/settings.json`

### Full Annotated Example

```json
{
  "version": "2.0.0",  // Config schema version

  // Layer enablement
  "layers": {

    // Layer 1: Foundation (Always enabled - required)
    "layer1": {
      "enabled": true,
      "description": "Foundation - Plugin Dev Skill"
    },

    // Layer 2: Automation & Intelligence (Optional)
    "layer2": {
      "enabled": true,  // Master switch for all Layer 2

      "features": {
        // PKM System (Structured management)
        "pkm": {
          "enabled": true,  // Enable PKM skills/commands/agents

          "permissions": {
            // File read permissions
            "fileRead": ["*"],  // "*" = all folders
            // Alternatives:
            // ["00_Inbox", "01_Projects"] = specific folders
            // ["*.md"] = file pattern matching

            // File write permissions
            "fileWrite": [
              "00_Inbox",    // Quick captures
              "06_Metadata"  // Goal tracking
            ],
            // WARNING: ["*"] = full vault write access
            // Use cautiously, test first

            // Command execution
            "commandExecution": true  // Allow /daily, /weekly, etc.
          }
        },

        // Second Brain (AI-driven insights) - DISABLED
        "secondBrain": {
          "enabled": false,  // Keep disabled for simplicity
          // When enabled, add:
          // "analysisFrequency": "weekly",
          // "patternThreshold": 3,  // Min occurrences to detect pattern
          // "autoSuggestions": true
        }
      }
    },

    // Layer 3: Advanced Integrations (Optional)
    "layer3": {
      "enabled": true,  // Master switch for all Layer 3

      "features": {
        // MCP Server (External API) - DISABLED
        "mcpServer": {
          "enabled": false,  // Not needed for personal use
          "port": 22360,     // Default port when enabled
          "host": "localhost",  // Only local by default
          "cors": false     // Enable for external access
        },

        // CLI Plugin (Obsidian UI) - ENABLED
        "cliPlugin": {
          "enabled": true,

          // Path to Claude Code CLI executable
          "cliPath": "/usr/bin/claude",
          // Find yours: `which claude`
          // Common paths:
          //   - macOS: /usr/local/bin/claude
          //   - Linux: /usr/bin/claude
          //   - Windows: C:\Program Files\Claude Code\claude.exe

          // Plugin identification
          "pluginId": "claude-code-integration",
          "pluginVersion": "1.0.11",

          // Session settings
          "sessionTimeout": 1800000,  // 30 min (milliseconds)
          "maxSessions": 10,  // Max stored sessions per vault

          // UI preferences
          "chatPosition": "right",  // "right" | "left" | "modal"
          "theme": "auto"  // "auto" | "light" | "dark"
        }
      }
    }
  },

  // Feature-specific settings
  "featureToggles": {

    // Goal tracking strategy
    "goalTracking": {
      "enabled": true,
      "strategy": "pkm",  // "pkm" | "second-brain" | "hybrid"

      // PKM-specific settings
      "hierarchy": [
        "3-year",
        "yearly",
        "monthly",
        "weekly",
        "daily"
      ],
      "reminderFrequency": "weekly",  // Weekly alignment check

      // Hybrid mode settings (when strategy = "hybrid")
      // "syncDirection": "pkm-to-brain",  // or "brain-to-pkm"
      // "conflictResolution": "manual"
    },

    // Weekly review workflow
    "weeklyReview": {
      "enabled": true,
      "pipeline": [
        "pkm/collection"
        // Add more stages when enabling Second Brain:
        // "second-brain/analysis",
        // "system-evolution"
      ],

      // Review schedule
      "dayOfWeek": 0,  // 0 = Sunday, 6 = Saturday
      "reminder": true
    }
  }
}
```

---

## Common Configuration Scenarios

### Scenario 1: Restrict File Write Access

**Use Case**: Allow PKM to read vault, but only write to inbox

```json
"pkm": {
  "permissions": {
    "fileRead": ["*"],
    "fileWrite": ["00_Inbox"]  // Only inbox, no metadata
  }
}
```

**Effect**:
- ✅ Can read all notes for context
- ✅ Can add new captures to inbox
- ❌ Cannot update goal tracker
- ❌ Cannot auto-organize existing notes

---

### Scenario 2: Enable Project Auto-Organization

**Use Case**: Let PKM organize project notes automatically

```json
"pkm": {
  "permissions": {
    "fileRead": ["*"],
    "fileWrite": [
      "00_Inbox",
      "01_Projects",  // ADD: Project folder
      "06_Metadata"
    ]
  }
}
```

**Effect**:
- ✅ Can move notes from inbox to projects
- ✅ Can update project files
- ❌ Still can't modify Areas/Resources/Archive

---

### Scenario 3: Full Automation (Advanced)

**Use Case**: Trust PKM with full vault access

```json
"pkm": {
  "permissions": {
    "fileRead": ["*"],
    "fileWrite": ["*"],  // FULL ACCESS
    "commandExecution": true
  }
}
```

**WARNING**: Test in a backup vault first!

**Effect**:
- ✅ Can reorganize entire vault
- ✅ Maximum automation potential
- ⚠️ Can accidentally modify critical files

---

### Scenario 4: Enable Second Brain

**Use Case**: Add AI-driven insights to structured PKM

**Step 1**: Enable in settings.json
```json
"layer2": {
  "features": {
    "secondBrain": {
      "enabled": true,
      "analysisFrequency": "weekly",
      "patternThreshold": 3,
      "autoSuggestions": true
    }
  }
}
```

**Step 2**: Update feature toggles
```json
"goalTracking": {
  "strategy": "hybrid"  // Change from "pkm"
}
```

**Step 3**: Update weekly review pipeline
```json
"weeklyReview": {
  "pipeline": [
    "pkm/collection",
    "second-brain/analysis"  // ADD
  ]
}
```

**Step 4**: Enable in skills registry
```bash
# Edit .claude/skills/_index.json
"second-brain": {
  "enabled": true  // Change from false
}
```

---

### Scenario 5: Enable MCP Server

**Use Case**: Allow external tools to access vault

**Step 1**: Enable in settings.json
```json
"layer3": {
  "features": {
    "mcpServer": {
      "enabled": true,
      "port": 22360,
      "host": "localhost",  // Local only (safe)
      "cors": false  // Disable CORS initially
    }
  }
}
```

**Step 2**: Test connection
```bash
# In another terminal
curl http://localhost:22360/health

# Expected: {"status":"ok","version":"1.0.0"}
```

**Step 3**: (Optional) Enable CORS for external access
```json
"mcpServer": {
  "cors": true,
  "allowedOrigins": [
    "http://localhost:3000"  // Your dev server
  ]
}
```

**Security Note**: Only enable CORS if needed. Keep server local-only by default.

---

## Feature Toggles (`features.json`)

**Location**: `.claude/config/features.json`

### Full Example with All Options

```json
{
  "version": "1.0.0",

  // Goal tracking configuration
  "goalTracking": {
    "enabled": true,
    "strategy": "pkm",  // "pkm" | "second-brain" | "hybrid"

    // PKM strategy settings
    "pkm": {
      "hierarchyLevels": ["3-year", "yearly", "monthly", "weekly", "daily"],
      "checkboxStyle": "standard",  // "standard" | "emoji"
      "reminderDay": 0,  // Sunday
      "autoArchive": true  // Archive completed yearly goals
    },

    // Second Brain strategy settings (when enabled)
    "secondBrain": {
      "analysisFrequency": "weekly",
      "patternThreshold": 3,  // Min occurrences
      "confidenceLevel": 0.7,  // 0-1
      "autoSuggestions": true
    },

    // Hybrid strategy settings
    "hybrid": {
      "primarySource": "pkm",  // "pkm" | "second-brain"
      "syncDirection": "both",  // "both" | "pkm-to-brain" | "brain-to-pkm"
      "conflictResolution": "manual"  // "manual" | "primary-wins"
    }
  },

  // Weekly review configuration
  "weeklyReview": {
    "enabled": true,
    "pipeline": ["pkm/collection"],

    // Schedule
    "schedule": {
      "dayOfWeek": 0,  // 0 = Sunday
      "preferredTime": "19:00",  // 7 PM
      "reminder": true
    },

    // Pipeline stage settings
    "stages": {
      "pkm/collection": {
        "duration": "20-30min",
        "prompts": [
          "What did I accomplish this week?",
          "What challenges did I face?",
          "What are my top 3 priorities for next week?"
        ]
      },

      // When Second Brain enabled:
      "second-brain/analysis": {
        "duration": "10min",
        "include": ["patterns", "sentiment", "suggestions"]
      },

      // When system evolution enabled:
      "system-evolution": {
        "duration": "5min",
        "autoApply": false  // Manual review recommended
      }
    }
  },

  // Additional feature toggles
  "inboxProcessing": {
    "enabled": true,
    "frequency": "weekly",
    "autoSuggest": true,  // Suggest PARA categorization
    "requireConfirmation": true
  },

  "noteOrganization": {
    "enabled": true,
    "autoFix": {
      "fileNaming": true,  // Fix naming convention violations
      "folderPlacement": true,  // Suggest better folders
      "duplicates": "warn"  // "warn" | "merge" | "ignore"
    }
  }
}
```

---

## Registries Configuration

### Skills Registry (`skills/_index.json`)

```json
{
  "version": "1.0.0",
  "registry": {

    // Layer 1: Foundation
    "plugin-dev": {
      "enabled": true,
      "type": "core",
      "path": "skills/plugin-dev/SKILL.md",
      "description": "Obsidian plugin development with 27 ESLint rules",
      "layer": 1,

      // Activation rules
      "triggers": {
        "filePath": [".obsidian/plugins/**"],
        "extension": [".ts", ".tsx"],
        "keywords": ["Plugin", "App", "Vault"]
      }
    },

    // Layer 2: PKM
    "pkm": {
      "enabled": true,
      "type": "automation",
      "path": "skills/pkm/",
      "description": "PKM system with 3 skills",
      "layer": 2,

      "skills": [
        "goal-tracking",
        "daily-workflow",
        "obsidian-vault-ops"
      ],

      "triggers": {
        "keywords": ["goal", "progress", "milestone", "daily"],
        "commands": ["/daily", "/weekly"],
        "folders": ["06_Metadata/goal-tracker"]
      }
    },

    // Layer 2: Second Brain (Disabled)
    "second-brain": {
      "enabled": false,
      "type": "intelligence",
      "path": "skills/second-brain/",
      "description": "Self-evolving knowledge system with 6 skills",
      "layer": 2,

      "skills": [
        "pattern-detector",
        "knowledge-linker",
        "insight-synthesizer",
        "skill-suggester",
        "vault-evolver",
        "meta-learner"
      ],

      "triggers": {
        "automatic": true,  // Always runs in background
        "frequency": "continuous"
      }
    }
  }
}
```

---

### Commands Registry (`commands/_index.json`)

```json
{
  "version": "1.0.0",
  "registry": {

    "pkm": {
      "enabled": true,
      "commands": [
        "daily",
        "weekly",
        "onboard",
        "push"
      ],
      "path": "commands/pkm/",
      "layer": 2,

      // Command-specific settings
      "commandSettings": {
        "daily": {
          "description": "Start daily reflection",
          "requiredFiles": ["00_Inbox/"],
          "duration": "10min"
        },

        "weekly": {
          "description": "Start weekly review",
          "requiredFiles": ["06_Metadata/weekly-review/"],
          "duration": "20-30min",
          "prerequisites": ["Goal tracker populated"]
        },

        "onboard": {
          "description": "Vault setup wizard",
          "runOnce": true,
          "createsFolders": true
        },

        "push": {
          "description": "Git commit & push automation",
          "requiresGit": true,
          "confirmBeforePush": true
        }
      }
    }
  }
}
```

---

### Agents Registry (`agents/_index.json`)

```json
{
  "version": "1.0.0",
  "registry": {

    "pkm": {
      "enabled": true,
      "agents": [
        "note-organizer",
        "weekly-reviewer",
        "goal-aligner",
        "inbox-processor"
      ],
      "path": "agents/pkm/",
      "layer": 2,

      // Agent-specific settings
      "agentSettings": {
        "note-organizer": {
          "frequency": "on-save",
          "checks": ["naming", "folder", "links"],
          "autoFix": false  // Suggest, don't auto-fix
        },

        "weekly-reviewer": {
          "frequency": "weekly",
          "dayOfWeek": 0,
          "dependencies": ["goal-aligner"]
        },

        "goal-aligner": {
          "frequency": "on-goal-update",
          "checkLevels": ["daily", "weekly", "monthly"],
          "warnOnMisalignment": true
        },

        "inbox-processor": {
          "frequency": "weekly",
          "suggestOnly": true,  // Don't auto-move
          "requireConfirmation": true
        }
      }
    }
  }
}
```

---

## Environment Variables

**Create `.env` file** (gitignored):

```bash
# API Keys
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Claude Code CLI
CLAUDE_CLI_PATH=/usr/bin/claude

# MCP Server (when enabled)
MCP_SERVER_PORT=22360
MCP_SERVER_HOST=localhost

# Development
NODE_ENV=production  # or 'development'
LOG_LEVEL=info  # error | warn | info | debug
```

**Load in shell** (add to `.zshrc` or `.bashrc`):
```bash
# Load vault environment
if [ -f "$HOME/Documents/obs-averivendell/.env" ]; then
  export $(cat "$HOME/Documents/obs-averivendell/.env" | xargs)
fi
```

---

## Validation & Testing

### Validate Configuration

```bash
# Run health check
cd /home/averypi/Documents/obs-averivendell
node .claude/scripts/doctor.cjs

# Should show:
# ✅ All checks passing
# ⚠️  Version inconsistency (safe to ignore)
```

### Test Individual Components

**Test PKM Commands**:
```bash
# In Obsidian or Claude Code
/daily
# Should trigger daily reflection

/weekly
# Should start weekly review
```

**Test Obsidian Plugin**:
1. Open Obsidian
2. `Ctrl+P` → "Open Claude Code view"
3. Type test message
4. Verify response streams correctly

**Test MCP Server** (if enabled):
```bash
curl http://localhost:22360/health
# Expected: {"status":"ok"}

curl http://localhost:22360/api/notes
# Should list vault notes
```

---

## Configuration Best Practices

### 1. Start Minimal, Expand Gradually

```
Week 1: Layer 1 + PKM only
Week 2: Enable goal tracking
Week 3: Enable weekly review
Week 4: Test expanded permissions
Month 2: Consider Second Brain
```

### 2. Backup Before Major Changes

```bash
# Before enabling new layer
cp .claude/config/settings.json .claude/config/settings.json.backup

# Test new config
node .claude/scripts/doctor.cjs

# If issues, restore
mv .claude/config/settings.json.backup .claude/config/settings.json
```

### 3. Version Control Configuration

```bash
# Track config changes
git add .claude/config/
git commit -m "config: enable Second Brain"

# Revert if needed
git checkout HEAD~1 -- .claude/config/
```

### 4. Document Custom Changes

Add comments to JSON files:
```json
{
  "_comment": "2025-12-30: Enabled Second Brain for pattern detection",
  "secondBrain": {
    "enabled": true
  }
}
```

---

## Migration Guides

### From PKM-Only to Hybrid

**Step 1**: Enable Second Brain
```json
"secondBrain": { "enabled": true }
```

**Step 2**: Change strategy
```json
"goalTracking": { "strategy": "hybrid" }
```

**Step 3**: Update pipeline
```json
"pipeline": ["pkm/collection", "second-brain/analysis"]
```

**Step 4**: Run first hybrid review
```bash
/weekly
# PKM Q&A, then AI insights
```

---

### From CLI Plugin to MCP Server

**Keep both enabled** (recommended):
```json
"cliPlugin": { "enabled": true },   // Personal use
"mcpServer": { "enabled": true }    // Automation
```

**Or switch entirely**:
```json
"cliPlugin": { "enabled": false },
"mcpServer": { "enabled": true, "port": 22360 }
```

**Update external tools** to use MCP API instead of CLI.

---

## Troubleshooting Configuration

### Issue: Changes Not Taking Effect

**Solution**: Reload configuration
```bash
# Run health check to validate
node .claude/scripts/doctor.cjs

# Restart Obsidian (if using plugin)
# Restart Claude Code session
```

---

### Issue: Permission Errors

**Solution**: Check file permissions
```bash
chmod 644 .claude/config/*.json
chmod 755 .claude/*/
```

---

### Issue: JSON Syntax Errors

**Solution**: Validate JSON
```bash
# Use jq to validate
cat .claude/config/settings.json | jq .

# If error, shows line number
```

---

## Related Documentation

- **Integration Guide**: `INTEGRATION_GUIDE.md`
- **Feature Comparison**: `FEATURE_COMPARISON.md`
- **Main Vault Config**: `CLAUDE.md`

---

**Version**: 2.0.0
**Last Updated**: 2025-12-30

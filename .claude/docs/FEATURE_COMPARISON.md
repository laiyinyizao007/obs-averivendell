# Feature Comparison Matrix

**Version**: 2.0.0
**Last Updated**: 2025-12-30

---

## Layer Comparison

### Overview Matrix

| Layer | Status | Purpose | Components | Complexity | Recommended For |
|-------|--------|---------|------------|------------|-----------------|
| **Layer 1** | ✅ Enabled | Foundation | 1 skill, 8 refs | Low | Everyone |
| **Layer 2 - PKM** | ✅ Enabled | Automation | 3 skills, 4 commands, 4 agents | Medium | Job search, projects |
| **Layer 2 - Second Brain** | ⏸️ Disabled | Intelligence | 6 skills, auto-evolving | High | Long-term knowledge work |
| **Layer 3 - CLI Plugin** | ✅ Enabled | UI Integration | Obsidian plugin | Low | Interactive users |
| **Layer 3 - MCP Server** | ⏸️ Disabled | External Integration | API server | Medium | Tool developers |

---

## Goal Tracking Strategies

### PKM Strategy (Current - Enabled)

**Philosophy**: Explicit, structured, human-driven

**Structure**:
```
3-Year Goals (Top-Level Vision)
  └── Yearly Goals (Annual Objectives)
      └── Monthly Goals (Focus Areas)
          └── Weekly Goals (Actionable Tasks)
              └── Daily Goals (Today's Actions)
```

**Data Entry**:
- Manual: User explicitly writes goals
- Template-driven: Structured markdown files
- Location: `06_Metadata/goal-tracker/`

**Progress Tracking**:
- Checkbox system: `- [ ]` / `- [x]`
- Weekly review: Manual reflection
- Alignment check: Agent compares daily ↔ weekly ↔ yearly

**Strengths**:
- ✅ Clear accountability
- ✅ Predictable structure
- ✅ Easy to audit
- ✅ Works for time-bound goals (job search, projects)

**Limitations**:
- ❌ Requires manual updates
- ❌ Can feel rigid
- ❌ Doesn't capture emergent insights

**Best For**:
- Job search campaigns
- Project milestones
- Short-term (3-12 month) objectives
- Users who prefer control and structure

---

### Second Brain Strategy (Disabled - Optional)

**Philosophy**: Implicit, emergent, AI-driven

**Structure**:
```
Notes (Daily captures)
  → AI Analysis (Pattern detection)
      → Emergent Goals (Discovered intentions)
          → Auto-Alignment (Skill suggestions)
```

**Data Entry**:
- Automatic: AI extracts goals from notes
- Pattern-based: Identifies recurring themes
- Location: Distributed across vault

**Progress Tracking**:
- AI inference: Analyzes note frequency
- Sentiment analysis: Detects enthusiasm/frustration
- Auto-suggestions: "You seem focused on X, create goal?"

**Strengths**:
- ✅ Low manual effort
- ✅ Discovers unexpected patterns
- ✅ Adapts to changing interests
- ✅ Works for long-term, evolving goals

**Limitations**:
- ❌ Less explicit accountability
- ❌ Requires trust in AI
- ❌ Can miss deliberate goals if not captured in notes

**Best For**:
- Researchers
- Writers
- Long-term knowledge work
- Users who prefer emergence over structure

---

### Hybrid Strategy (Available When Both Enabled)

**Combines**:
- PKM: Short-term, explicit goals (job search, projects)
- Second Brain: Long-term, emergent insights (career growth, learning)

**Workflow**:
1. PKM captures immediate goals (next 3-12 months)
2. Second Brain analyzes daily notes for patterns
3. Weekly review: PKM structured + Second Brain insights
4. Second Brain suggests new PKM goals based on detected patterns

**Example**:
```
PKM Explicit Goal: "Land AI PM role by Q2 2025"
  ├── Weekly: Apply to 5 companies
  ├── Daily: Update resume

Second Brain Insight: "You mention 'hardware design' 12x this month"
  └── Suggested Goal: "Build hardware portfolio project"
      └── Feeds into: PKM "Create ESP32 autodiary" project
```

**Strengths**:
- ✅ Best of both worlds
- ✅ Structured + emergent
- ✅ Short-term + long-term alignment

**Limitations**:
- ❌ Most complex setup
- ❌ Requires both systems enabled
- ❌ Higher cognitive load

---

## Weekly Review Comparison

### PKM Collection (Current)

**Process**:
1. Structured Q&A workflow
2. Manual reflection prompts
3. Checkbox review
4. Goal progress updates

**Duration**: 20-30 minutes

**Output**:
- `06_Metadata/weekly-review/YYYY-MM-DD-WeeklyReview.md`
- Updated goal checkboxes
- Next week priorities

**Questions**:
- What did I accomplish this week?
- What challenges did I face?
- Are my weekly goals aligned with yearly goals?
- What are my top 3 priorities for next week?

**Strengths**:
- ✅ Predictable time commitment
- ✅ Clear structure
- ✅ Manual control

**Limitations**:
- ❌ No automatic insights
- ❌ Doesn't analyze patterns across weeks

---

### PKM + Second Brain Analysis

**Process**:
1. PKM structured review (as above)
2. **+** Second Brain pattern analysis
3. AI-generated insights
4. Suggested adjustments

**Duration**: 30-40 minutes (10min extra for AI insights)

**Additional Outputs**:
- Pattern detection: "You wrote about X 8x this week"
- Sentiment analysis: "Enthusiasm increasing for Y topic"
- Skill suggestions: "Consider learning Z based on your notes"

**Example Insight**:
```markdown
## AI-Detected Patterns

**Recurring Theme**: Hardware design (mentioned 8x)
  - 2025-12-23: ESP32 schematic research
  - 2025-12-25: Circuit debugging notes
  - 2025-12-28: Component ordering

**Suggested Action**: Create dedicated hardware project in 01_Projects/
```

**Strengths**:
- ✅ Automatic pattern detection
- ✅ Surfaces hidden themes
- ✅ Suggests new directions

**Limitations**:
- ❌ Longer duration
- ❌ Requires Second Brain enabled
- ❌ AI insights can be hit-or-miss

---

### Full Pipeline (PKM + Second Brain + System Evolution)

**Process**:
1. PKM collection
2. Second Brain analysis
3. **+** System evolution (auto-update skills)

**Duration**: 40-60 minutes

**System Evolution**:
- Reviews which skills were useful this week
- Suggests new skills to add
- Proposes obsolete skills to disable
- Auto-updates skill priorities

**Example**:
```markdown
## System Evolution Recommendations

**High-Use Skills** (keep enabled):
- goal-tracking: Used 12x this week
- daily-workflow: Used 7x this week

**Low-Use Skills** (consider disabling):
- obsidian-vault-ops: Used 0x in 4 weeks

**Suggested New Skills**:
- "hardware-bom-generator" (based on component ordering notes)
```

**Strengths**:
- ✅ Self-optimizing system
- ✅ Learns from your behavior
- ✅ Reduces cruft over time

**Limitations**:
- ❌ Longest duration
- ❌ Highest complexity
- ❌ Requires all systems enabled

---

## Permission Models

### Minimum Privilege (Recommended)

**Current Configuration**:
```json
"permissions": {
  "fileRead": ["*"],
  "fileWrite": ["00_Inbox", "06_Metadata"],
  "commandExecution": true
}
```

**Access**:
- Read: Entire vault
- Write: Only inbox and metadata
- Commands: Can execute `/daily`, `/weekly`, etc.

**Strengths**:
- ✅ Safest option
- ✅ Prevents accidental overwrites
- ✅ Clear boundaries

**Limitations**:
- ❌ Can't auto-organize notes outside inbox
- ❌ Can't auto-update project files

**Best For**: Initial setup, cautious users

---

### Expanded Write Access

**Configuration**:
```json
"permissions": {
  "fileRead": ["*"],
  "fileWrite": ["00_Inbox", "01_Projects", "06_Metadata"],
  "commandExecution": true
}
```

**Access**:
- Write: Inbox + Projects + Metadata

**Use Case**: Allow PKM to auto-organize project notes

**Strengths**:
- ✅ More automation
- ✅ Can update project files

**Limitations**:
- ❌ Slightly higher risk
- ❌ Need to trust automation

**Best For**: Users who want more automation

---

### Full Vault Access (Advanced)

**Configuration**:
```json
"permissions": {
  "fileRead": ["*"],
  "fileWrite": ["*"],
  "commandExecution": true
}
```

**Access**: Unrestricted

**Use Case**: Maximum automation, self-organizing vault

**Strengths**:
- ✅ Maximum flexibility
- ✅ Full automation potential
- ✅ Second Brain can reorganize freely

**Limitations**:
- ❌ Highest risk
- ❌ Need strong trust in AI
- ❌ Can accidentally modify important files

**Best For**: Advanced users, after testing in sandbox

---

## Skill Auto-Activation Comparison

### Layer 1: Plugin Dev Skill

**Trigger**: Context detection

**Activates When**:
- File path contains: `.obsidian/plugins/`
- File extension: `.ts`, `.tsx`
- Content mentions: `Plugin`, `App`, `registerEvent`

**Provides**:
- 27 ESLint rules
- Memory management guidelines
- Type safety checks

---

### Layer 2: PKM Skills

#### Goal Tracking
**Trigger**: Keyword detection

**Activates When**:
- User mentions: "goal", "progress", "milestone"
- File in: `06_Metadata/goal-tracker/`
- Command: `/weekly`, `/daily`

**Provides**:
- Goal hierarchy suggestions
- Alignment checks
- Progress summaries

#### Daily Workflow
**Trigger**: Temporal context

**Activates When**:
- Current date mentioned
- File name: `YYYY-MM-DD.md`
- Command: `/daily`

**Provides**:
- Daily reflection prompts
- Habit tracking
- Inbox suggestions

#### Vault Operations
**Trigger**: File management context

**Activates When**:
- User requests: "organize", "move", "rename"
- Multiple file operations needed
- PARA structure mentioned

**Provides**:
- PARA categorization suggestions
- File naming corrections
- Bulk operations

---

### Layer 2: Second Brain Skills (When Enabled)

#### Pattern Detector
**Trigger**: Continuous background

**Always Active When**: Second Brain enabled

**Provides**:
- Weekly pattern summaries
- Theme identification
- Emerging interest detection

#### Knowledge Linker
**Trigger**: Note creation/edit

**Activates When**: Writing or editing notes

**Provides**:
- Automatic backlink suggestions
- Concept clustering
- Orphan note detection

#### Insight Synthesizer
**Trigger**: Weekly review

**Activates When**: `/weekly` command + Second Brain enabled

**Provides**:
- Cross-week pattern analysis
- Long-term trend detection
- Goal drift warnings

---

## Plugin vs MCP Server

### CLI Plugin (Current - Enabled)

**Architecture**: Obsidian UI → Claude Code CLI → Anthropic API

**Use Case**: Interactive chat within Obsidian

**Features**:
- Real-time streaming
- Visual todo list
- Change preview
- Session persistence

**Strengths**:
- ✅ User-friendly UI
- ✅ No server management
- ✅ Per-note sessions
- ✅ Visual feedback

**Limitations**:
- ❌ Obsidian-only
- ❌ Requires Obsidian Desktop
- ❌ One user at a time

**Best For**: Personal vault users, interactive workflows

---

### MCP Server (Disabled - Optional)

**Architecture**: External Tools → MCP Server → Claude Code → Vault

**Use Case**: External tool integration (CI/CD, scripts, other apps)

**Features**:
- RESTful API
- Programmatic access
- Multi-client support
- Read-only by default

**Strengths**:
- ✅ External tool integration
- ✅ API-driven automation
- ✅ Multi-user potential
- ✅ Scriptable

**Limitations**:
- ❌ Requires server setup
- ❌ Network configuration
- ❌ Security considerations (port 22360)

**Best For**: DevOps, CI/CD pipelines, team vaults

---

### Dual-Channel Architecture (Both Enabled)

**Configuration**:
```json
"layer3": {
  "features": {
    "cliPlugin": {
      "enabled": true  // Interactive UI
    },
    "mcpServer": {
      "enabled": true,  // Programmatic API
      "port": 22360
    }
  }
}
```

**Use Cases**:
- User: Interactive UI in Obsidian (CLI Plugin)
- Scripts: Automated vault updates (MCP Server)
- CI/CD: Build-time documentation generation (MCP Server)

**Port Conflict**: None - they run on different channels
- CLI Plugin: stdin/stdout subprocess
- MCP Server: Network socket :22360

**Strengths**:
- ✅ Best of both worlds
- ✅ No conflicts
- ✅ Maximum flexibility

**Limitations**:
- ❌ More complex setup
- ❌ Two systems to maintain

---

## Decision Matrix

### When to Enable Second Brain

**Enable If**:
- [ ] You write daily notes consistently (>5x/week)
- [ ] Your goals evolve frequently
- [ ] You want automatic pattern detection
- [ ] You trust AI-driven insights

**Keep Disabled If**:
- [ ] You prefer manual control
- [ ] Your goals are time-bound and explicit (job search)
- [ ] You want simplicity
- [ ] You're still learning the system

---

### When to Enable MCP Server

**Enable If**:
- [ ] You need external tool integration
- [ ] You run CI/CD pipelines
- [ ] You want programmatic vault access
- [ ] You're comfortable with server management

**Keep Disabled If**:
- [ ] Personal vault only
- [ ] No automation needs
- [ ] Security concerns with open ports
- [ ] Obsidian plugin is sufficient

---

### Recommended Configurations

#### Configuration 1: Beginner (Current)
```json
{
  "layer1": true,
  "layer2": { "pkm": true, "secondBrain": false },
  "layer3": { "cliPlugin": true, "mcpServer": false }
}
```
**For**: New users, job seekers, project managers

---

#### Configuration 2: Power User
```json
{
  "layer1": true,
  "layer2": { "pkm": true, "secondBrain": true },
  "layer3": { "cliPlugin": true, "mcpServer": false }
}
```
**For**: Researchers, writers, knowledge workers

---

#### Configuration 3: Developer
```json
{
  "layer1": true,
  "layer2": { "pkm": true, "secondBrain": true },
  "layer3": { "cliPlugin": true, "mcpServer": true }
}
```
**For**: DevOps, automation enthusiasts, team environments

---

## Related Documentation

- **Integration Guide**: `INTEGRATION_GUIDE.md`
- **Configuration**: `.claude/config/settings.json`
- **Plugin Documentation**: `.claude/integrations/obsidian-plugin/README.md`

---

**Version**: 2.0.0
**Last Updated**: 2025-12-30

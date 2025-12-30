# 🤖 Agents Configuration

Claude Code agent configurations and instructions for specialized assistants.

## Purpose
Store custom agent definitions, behavior configurations, and specialized instructions for Claude Code.

## Agent Types

### Thinking Partner
**File:** `thinking-partner.md`
- Helps with ideation and problem analysis
- Asks clarifying questions
- Provides different perspectives

### Research Assistant  
**File:** `research-assistant.md`
- Gathers and synthesizes information
- Structures research findings
- Creates comprehensive summaries

### Code Editor
**File:** `code-editor.md`
- Reviews and improves code quality
- Suggests best practices
- Handles refactoring tasks

### Project Manager
**File:** `project-manager.md`
- Breaks down complex tasks
- Creates project plans
- Tracks progress and deadlines

### Hardware Assistant
**File:** `hardware-assistant.md`
- ESP32/Arduino development help
- Circuit design guidance
- Component selection advice

## Usage with Claude Code

```
Use the instructions in 06_Metadata/Agents/thinking-partner.md
and help me brainstorm solutions for [problem].
```

## Creating New Agents

1. Create new `.md` file with agent name
2. Follow the standard format:
   ```markdown
   # Agent: [Name]
   
   You are a [role description].
   
   ## Core Behaviors
   - Behavior 1
   - Behavior 2
   
   ## Workflow
   1. Step 1
   2. Step 2
   
   ## Constraints
   - Don't do X
   - Always do Y
   ```

3. Test with Claude Code
4. Iterate based on results

## Best Practices

- **Be specific** - Clear instructions produce better results
- **Set boundaries** - Define what the agent should NOT do
- **Include examples** - Show expected input/output formats
- **Test thoroughly** - Verify behavior across different scenarios
- **Version control** - Keep archive of working configurations
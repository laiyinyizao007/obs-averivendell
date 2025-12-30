# Claude Code Commands

Pre-configured commands to enhance your Claude Code + Obsidian workflow.

## Available Commands

### Daily Workflow (Complementary - Use Both!)

**Morning Setup:**
```
/daily
```
Create today's note with template variables ({{date}}, {{date-1}}, {{date+1}})
- **Time**: 2-5 minutes
- **Best for**: Morning routine, note creation

**Evening Reflection:**
```
/daily-review
```
Reflect on accomplishments, insights, and set tomorrow's priorities
- **Time**: 10-15 minutes
- **Best for**: Daily shutdown ritual, progress tracking

### Weekly Workflow (Choose Your Style)

Which one fits you better?

**🎯 For Doers & Project Managers:**
```
/weekly
```
30-minute structured GTD review
- **Focus**: "What did I accomplish? What's next?"
- **Output**: Goal alignment, metrics, actionable tasks
- **Best for**: Job search, project tracking, execution-oriented work

**🧠 For Thinkers & Researchers:**
```
/weekly-synthesis
```
60-90 minute deep pattern analysis
- **Focus**: "What did I learn? What themes emerged?"
- **Output**: Insights, connections, energy audit, questions
- **Best for**: Research, writing, knowledge work, creative projects

### PKM System Commands

```
/onboard
```
Load all vault context (run this first when starting with the vault!)

```
/push
```
Git commit & push automation

### Thinking & Research Commands

**🤔 thinking-partner**
```
/thinking-partner
```
Engage Claude as a thinking partner for exploring complex problems
- **Best for**: Brainstorming, problem exploration, developing ideas

**🔍 research-assistant**
```
/research-assistant
```
Conduct thorough research on any topic using your vault
- **Best for**: Deep dives, literature reviews, knowledge synthesis

**📥 inbox-processor**
```
/inbox-processor
```
Process and organize items in your Inbox folder
- **Best for**: Weekly inbox cleanup, organizing captures

## Creating Custom Commands

1. Create a new `.md` file in this directory
2. Name it descriptively (kebab-case)
3. Structure it with:
   - Clear role definition
   - Specific process steps
   - Expected output format
   - Tips and constraints

## Using Commands

### Method 1: Direct (in Claude Code)

```
/[command-name]
```

### Method 2: Reference in Chat

```
Use the thinking-partner command to help me explore [topic]
```

### Method 3: Manual

```
Follow the instructions in .claude/commands/[command].md
```

## Tips

- Commands are just structured prompts
- Modify them based on your needs
- Combine commands for complex workflows
- Share your custom commands with the community

## Command Ideas

Consider creating commands for:

- Project retrospectives
- Meeting notes processing
- Book notes extraction
- Idea development
- Content planning
- Learning path creation
- Decision analysis

Remember: The best commands emerge from your actual workflows.

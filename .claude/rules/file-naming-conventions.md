# File Naming Conventions

**Universal Format:** `YYYY-MM-DD-Context-DescriptiveTitle.md`

---

## Core Principles

1. **Date First:** Always start with `YYYY-MM-DD` for chronological sorting
2. **Context Next:** Add project/area identifier for grouping
3. **Title Last:** Clear, descriptive, human-readable title
4. **Hyphens Only:** Use `-` to separate parts (not underscores or spaces)
5. **CamelCase Optional:** Can use CamelCase for readability in longer titles

---

## Format Breakdown

```
YYYY-MM-DD-Context-DescriptiveTitle.md
│        │ │       │ └─ What is this about?
│        │ │       └─ Which project/area/topic?
│        │ └─ Separator (hyphen)
│        └─ Date in ISO format (YYYY-MM-DD)
└─ Always starts with date
```

**Examples:**
- `2025-12-30-JobSearch-CompanyResearch-OpenAI.md`
- `2025-12-30-ESP32Autodiary-HardwareSetup-SensorIntegration.md`
- `2025-12-30-ClaudeCode-BestPractices-MCPServerDevelopment.md`

---

## Folder-Specific Conventions

### 00_Inbox/

**Daily Notes:**
```
YYYY-MM-DD.md
```
Example: `2025-12-30.md`

**Quick Captures:**
```
YYYY-MM-DD-QuickNote-Topic.md
YYYY-MM-DD-Idea-BriefDescription.md
YYYY-MM-DD-Meeting-PersonOrGroup.md
```

Examples:
- `2025-12-30-QuickNote-AIProductFeatureIdea.md`
- `2025-12-30-Idea-CyberdeckKeyboardLayout.md`
- `2025-12-30-Meeting-TeamStandup.md`

**Web Clips:**
```
YYYY-MM-DD-WebClip-ArticleTitle-Source.md
```
Example: `2025-12-30-WebClip-AI-Trends-TechCrunch.md`

---

### 01_Projects/

**Project Notes:**
```
YYYY-MM-DD-ProjectName-ComponentOrPhase.md
```

Examples:
- `2025-12-30-JobSearch-InterviewPrep-BehavioralQuestions.md`
- `2025-12-30-ESP32Autodiary-Firmware-SleepMode.md`
- `2025-12-30-NovelWriting-CharacterDev-Protagonist.md`
- `2025-12-30-CyberdeckBuild-CaseDesign-3DPrintingSpecs.md`

**Build Logs:**
```
YYYY-MM-DD-ProjectName-BuildLog-Milestone.md
```
Example: `2025-12-30-ESP32Autodiary-BuildLog-FirstPrototype.md`

**Meeting Notes:**
```
YYYY-MM-DD-ProjectName-Meeting-Topic.md
```
Example: `2025-12-30-JobSearch-Meeting-NetworkingCoffeeChat.md`

---

### 02_Areas/

**Area Reviews:**
```
YYYY-MM-DD-AreaName-Review.md
YYYY-MM-DD-AreaName-MonthlyReview.md
YYYY-MM-DD-AreaName-QuarterlyReview.md
```

Examples:
- `2025-12-30-Health-MonthlyReview.md`
- `2025-12-30-Finance-QuarterlyReview.md`
- `2025-12-30-CareerDevelopment-Review.md`

**Area Notes:**
```
YYYY-MM-DD-AreaName-Topic.md
```

Examples:
- `2025-12-30-Health-FitnessRoutineUpdate.md`
- `2025-12-30-Finance-BudgetAdjustments.md`
- `2025-12-30-ProfessionalNetwork-ContactUpdate.md`

---

### 03_Resources/

**Topic Notes:**
```
YYYY-MM-DD-TopicCategory-SpecificTopic.md
```

Examples:
- `2025-12-30-AIProductManagement-RoadmapPlanning.md`
- `2025-12-30-ESP32Development-PowerOptimization.md`
- `2025-12-30-ClaudeCode-MCPServerTutorial.md`
- `2025-12-30-RaspberryPi-ClusterSetup.md`

**Reference Materials:**
```
YYYY-MM-DD-Category-ReferenceName.md
```

Examples:
- `2025-12-30-ESP32-PinoutReference.md`
- `2025-12-30-Python-AsyncioPatterns.md`
- `2025-12-30-Git-WorkflowCheatSheet.md`

**Research Notes:**
```
YYYY-MM-DD-ResearchTopic-FindingsOrInsight.md
```

Examples:
- `2025-12-30-AIArchitecture-ToolComparison.md`
- `2025-12-30-JobMarket-SalaryBenchmarks.md`

---

### 04_Archive/

**Archived Project Summaries:**
```
YYYY-MM-DD-ProjectName-CompletionSummary.md
```
Example: `2025-06-15-WebsiteRedesign-CompletionSummary.md`

**Archived Notes:**
```
Original-Date-OriginalContext-Title-ARCHIVED.md
```
Example: `2024-03-15-JobSearch-Resume-v1-ARCHIVED.md`

**Backup Files:**
```
Filename.backup_YYYY-MM-DD.md
```
Example: `CLAUDE.md.backup_2025-12-30.md`

---

### 05_Attachments/

**Organized Files:**
```
YYYY-MM-DD-Context-Description.ext
```

Examples:
- `2025-12-30-ESP32-Circuit-Diagram.png`
- `2025-12-30-JobSearch-Resume-v2.pdf`
- `2025-12-30-CyberdeckBuild-Case-3DModel.stl`
- `2025-12-30-NovelWriting-CharacterSketch.jpg`

**Unprocessed Files (to be renamed):**
- `IMG_1234.png` → Rename to organized format
- `Screenshot 2025-12-30.png` → Rename with context
- `document.pdf` → Rename with date and description

---

### 06_Metadata/

**Templates:**
```
TemplateName-Template.md
```

Examples:
- `Weekly-Review-Template.md`
- `Project-Kickoff-Template.md`
- `Meeting-Notes-Template.md`

**Guides and References:**
```
GuideName.md
ConceptName.md
```

Examples:
- `PARA-Method-Guide.md`
- `File-Naming-Conventions.md`
- `Git-Workflow-Guide.md`

---

## Special Cases

### Daily Notes
**Format:** `YYYY-MM-DD.md` (no context needed)
**Location:** `00_Inbox/`
**Usage:** Stream of consciousness, daily capture

### Weekly Reviews
**Format:** `YYYY-MM-DD-WeeklyReview.md`
**Location:** `00_Inbox/` or create `Weekly-Reviews/` subfolder
**Usage:** End-of-week reflection and planning

### Meeting Notes
**Format:** `YYYY-MM-DD-Context-Meeting-Topic.md`
**Examples:**
- `2025-12-30-JobSearch-Meeting-TechnicalInterview.md`
- `2025-12-30-Team-Meeting-ProjectKickoff.md`

### Templates
**Format:** `Name-Template.md` (no date)
**Location:** `06_Metadata/Templates/`
**Reason:** Templates are timeless references

### README Files
**Format:** `README.md` (no date, all caps)
**Location:** Each folder
**Reason:** Standard documentation convention

---

## Character Rules

### Allowed Characters
- Letters: `A-Z`, `a-z`
- Numbers: `0-9`
- Hyphen: `-` (primary separator)
- Dot: `.` (for file extensions only)

### Avoid
- Spaces → Use `-` instead
- Underscores → Use `-` or CamelCase
- Special characters: `!@#$%^&*()+=[]{}|;:'",<>?/\`
- Non-ASCII characters (for compatibility)

### Length Guidelines
- **Total filename:** Keep under 100 characters
- **Title portion:** 30-50 characters ideal
- **Context:** 10-20 characters ideal

---

## CamelCase Usage

**When to use:**
- Long titles that need readability
- Project names with multiple words
- Technical terms

**Examples:**
- `JobSearch` instead of `job-search`
- `ESP32Autodiary` instead of `esp32-autodiary`
- `ClaudeCode` instead of `claude-code`

**Mixed approach is fine:**
```
2025-12-30-JobSearch-InterviewPrep-BehavioralQuestions.md
          └─ CamelCase  └─ CamelCase └─ CamelCase
```

---

## Migration Guide

### From Unstructured Names

**Old:** `meeting notes.md`
**New:** `2025-12-30-Team-Meeting-Notes.md`

**Old:** `esp32 project ideas.md`
**New:** `2025-12-30-ESP32Autodiary-ProjectIdeas.md`

**Old:** `README for project.md`
**New:** Keep as `README.md` (standard convention)

### Bulk Rename Script

```bash
# Rename files in current directory
# Add YYYY-MM-DD prefix based on file modification date
for file in *.md; do
  date=$(stat -c %y "$file" | cut -d' ' -f1)
  newname="${date}-${file}"
  mv "$file" "$newname"
done
```

---

## Why This System Works

### Benefits

1. **Chronological Sorting**
   - Files automatically sort by date
   - Easy to find recent work
   - Natural timeline of project evolution

2. **Contextual Grouping**
   - Project files cluster together
   - Easy to filter by context
   - Clear relationship between files

3. **Descriptive Titles**
   - Know what's inside without opening
   - Search-friendly
   - Self-documenting

4. **System-Agnostic**
   - Works on any OS
   - Compatible with git
   - No special characters that cause issues

5. **Human-Readable**
   - CamelCase improves readability
   - Hyphens are easy to scan
   - Dates are clear

---

## Quick Reference Cheat Sheet

| File Type | Format | Example |
|-----------|--------|---------|
| Daily Note | `YYYY-MM-DD.md` | `2025-12-30.md` |
| Project Note | `YYYY-MM-DD-Project-Topic.md` | `2025-12-30-JobSearch-Resume.md` |
| Area Note | `YYYY-MM-DD-Area-Topic.md` | `2025-12-30-Health-Fitness.md` |
| Resource | `YYYY-MM-DD-Category-Topic.md` | `2025-12-30-AI-ProductManagement.md` |
| Meeting | `YYYY-MM-DD-Context-Meeting-Topic.md` | `2025-12-30-Team-Meeting-Sprint.md` |
| Archive | `YYYY-MM-DD-Name-ARCHIVED.md` | `2024-12-30-OldProject-ARCHIVED.md` |
| Attachment | `YYYY-MM-DD-Context-Description.ext` | `2025-12-30-ESP32-Schematic.png` |
| Template | `Name-Template.md` | `Weekly-Review-Template.md` |

---

## Related Resources

- **PARA Method:** See `para-method-fundamentals.md` for folder structure
- **Inbox Processing:** See `00_Inbox/README.md` for weekly workflow
- **Attachments:** See `05_Attachments/README.md` for file organization

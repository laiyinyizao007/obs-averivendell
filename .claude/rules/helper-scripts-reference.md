# Helper Scripts Reference

**Complete guide to all vault management scripts and commands**

---

## Quick Command Reference

```bash
# Vault Statistics
pnpm vault:stats              # Show overall vault statistics

# Attachments Management
pnpm attachments:list         # List unprocessed attachments
pnpm attachments:count        # Count unprocessed files
pnpm attachments:organized    # Count organized files
pnpm attachments:sizes        # Show largest files
pnpm attachments:recent       # Files added in last 7 days
pnpm attachments:orphans      # Find unreferenced files
pnpm attachments:refs [file]  # Find references to specific file
pnpm attachments:create-organized  # Create organized folder structure

# Web Research (requires Firecrawl API key)
pnpm firecrawl:scrape -- "URL" "target/folder"
pnpm firecrawl:batch -- "urls.txt" "target/folder"
```

---

## Vault Statistics

### `pnpm vault:stats`

**Purpose:** Display comprehensive vault statistics

**Output:**
```
📊 Vault Statistics
===================
Total Files: 245
Total Notes: 198
Total Attachments: 47

By Folder:
- 00_Inbox: 12 notes
- 01_Projects: 45 notes
- 02_Areas: 23 notes
- 03_Resources: 89 notes
- 04_Archive: 15 notes
- 05_Attachments: 47 files
- 06_Metadata: 14 notes

Vault Size: 12.3 MB
Largest Folder: 03_Resources (5.2 MB)
```

**Usage:**
```bash
pnpm vault:stats
```

---

## Attachments Management

### View Status Commands

#### `pnpm attachments:list`

**Purpose:** List all unprocessed attachments (files not in Organized/ folder)

**Output:**
```
📎 Unprocessed Attachments
=========================
IMG_1234.png (2.3 MB) - 2025-12-28
IMG_1235.png (1.8 MB) - 2025-12-28
Screenshot 2025-12-30.png (856 KB) - 2025-12-30
document.pdf (1.2 MB) - 2025-12-29

Total: 4 files (6.1 MB)
```

**When to use:**
- Weekly attachment cleanup
- Before organizing files
- Checking what needs processing

---

#### `pnpm attachments:count`

**Purpose:** Quick count of unprocessed files

**Output:**
```
Unprocessed attachments: 4
```

**When to use:**
- Quick status check
- Scripting/automation

---

#### `pnpm attachments:organized`

**Purpose:** Count files in Organized/ folder

**Output:**
```
📁 Organized Attachments
========================
Images/: 23 files
PDFs/: 12 files
Data/: 5 files

Total: 40 files (15.2 MB)
```

**When to use:**
- Track progress on file organization
- Verify organized file structure

---

#### `pnpm attachments:sizes`

**Purpose:** Show largest files in attachments folder

**Output:**
```
📏 Largest Attachments
=====================
1. video-demo.mp4 (45.2 MB)
2. backup-archive.zip (23.5 MB)
3. presentation.pdf (12.3 MB)
4. IMG_5678.png (8.7 MB)
5. diagram-large.png (6.2 MB)

Total shown: 95.9 MB
```

**When to use:**
- Finding files to compress or delete
- Managing vault size
- Before git commits (find >10MB files)

---

#### `pnpm attachments:recent`

**Purpose:** Show files added in last 7 days

**Output:**
```
📅 Recent Attachments (Last 7 Days)
===================================
2025-12-30: 3 files (4.2 MB)
  - Screenshot 2025-12-30.png
  - ESP32-schematic.pdf
  - notes-diagram.png

2025-12-28: 2 files (4.1 MB)
  - IMG_1234.png
  - IMG_1235.png

Total: 5 files (8.3 MB)
```

**When to use:**
- Weekly review process
- Processing new captures

---

### Finding Issues

#### `pnpm attachments:orphans`

**Purpose:** Find attachment files not referenced in any note

**Output:**
```
🔍 Orphaned Attachments
=======================
Files with no references in vault:

IMG_old_1.png (2.1 MB) - Not linked in any note
screenshot_temp.png (856 KB) - Not linked in any note
draft_v1.pdf (1.2 MB) - Not linked in any note

Total: 3 orphaned files (4.1 MB)

Suggested actions:
- Review and delete if no longer needed
- Add references if still useful
- Move to Archive if historical
```

**When to use:**
- Monthly cleanup
- Before backing up vault
- Reducing vault size

**⚠️ Warning:** Don't auto-delete orphans - they might be:
- Recently added, not yet linked
- Intentionally standalone reference files
- Waiting to be processed from Inbox

---

#### `pnpm attachments:refs [filename]`

**Purpose:** Find all references to a specific file

**Usage:**
```bash
pnpm attachments:refs ESP32-schematic.pdf
```

**Output:**
```
🔗 References to: ESP32-schematic.pdf
====================================
Found in 3 notes:

1. 01_Projects/ESP32-Autodiary/2025-12-28-Hardware-Design.md
   Line 45: ![[05_Attachments/ESP32-schematic.pdf]]

2. 01_Projects/ESP32-Autodiary/README.md
   Line 23: See circuit diagram: [[05_Attachments/ESP32-schematic.pdf]]

3. 03_Resources/ESP32-Development/Schematics.md
   Line 12: Reference: [[ESP32-schematic.pdf]]

Total references: 3
```

**When to use:**
- Before deleting/renaming a file
- Understanding file usage
- Checking if orphan detection missed anything

---

### Organization

#### `pnpm attachments:create-organized`

**Purpose:** Create the Organized/ folder structure

**Creates:**
```
05_Attachments/
└── Organized/
    ├── Images/
    ├── PDFs/
    └── Data/
```

**Output:**
```
✅ Created organized folder structure
   - 05_Attachments/Organized/
   - 05_Attachments/Organized/Images/
   - 05_Attachments/Organized/PDFs/
   - 05_Attachments/Organized/Data/
```

**When to use:**
- First-time vault setup
- After accidentally deleting organized structure

---

## Web Research (Firecrawl)

**Prerequisites:** Firecrawl API key configured

```bash
# Set API key
export FIRECRAWL_API_KEY="fc-your-key-here"

# Or add to ~/.zshrc or ~/.bashrc for persistence
echo 'export FIRECRAWL_API_KEY="fc-your-key-here"' >> ~/.zshrc
```

### `pnpm firecrawl:scrape`

**Purpose:** Save a single web page as markdown

**Usage:**
```bash
pnpm firecrawl:scrape -- "https://example.com/article" "03_Resources/Articles"
```

**Arguments:**
1. URL (in quotes)
2. Target folder (relative to vault root)

**Output:**
```
🌐 Scraping: https://example.com/article
✅ Saved to: 03_Resources/Articles/2025-12-30-Example-Article.md

Content preview:
- Title: How to Build Better Products
- Word count: 2,345
- Images: 3
```

**Creates file:**
```
03_Resources/Articles/2025-12-30-Example-Article.md
```

**When to use:**
- Saving important articles for reference
- Building research collection
- Archiving web content before it disappears

---

### `pnpm firecrawl:batch`

**Purpose:** Save multiple URLs from a file

**Usage:**
```bash
# Create URL list file
cat > urls.txt << EOF
https://example.com/article1
https://example.com/article2
https://example.com/article3
EOF

# Batch scrape
pnpm firecrawl:batch -- "urls.txt" "03_Resources/Research"
```

**Arguments:**
1. File containing URLs (one per line)
2. Target folder

**Output:**
```
🌐 Batch Scraping
=================
Processing 3 URLs...

[1/3] https://example.com/article1
  ✅ Saved: 03_Resources/Research/2025-12-30-Article1.md

[2/3] https://example.com/article2
  ✅ Saved: 03_Resources/Research/2025-12-30-Article2.md

[3/3] https://example.com/article3
  ⚠️  Rate limited, retrying in 5s...
  ✅ Saved: 03_Resources/Research/2025-12-30-Article3.md

Summary:
- Successfully scraped: 3
- Failed: 0
- Total time: 45s
```

**When to use:**
- Research projects with multiple sources
- Building topic-specific knowledge bases
- Archiving course materials or tutorials

---

## Gemini Vision Integration

**Prerequisites:** Gemini API key configured

```bash
# Set API key
export GEMINI_API_KEY="your-key-here"

# Add to shell config for persistence
echo 'export GEMINI_API_KEY="your-key-here"' >> ~/.zshrc
```

### Image Analysis

**Usage in Claude Code:**
```
Use gemini-vision to analyze this circuit diagram:
05_Attachments/ESP32-schematic.png
```

**Capabilities:**
- Read text from images (OCR)
- Analyze technical diagrams
- Describe image content
- Extract data from screenshots
- Compare before/after images

**Example prompts:**
```
Analyze this screenshot and extract all error messages
Compare these two circuit diagrams and list differences
Read the text from this handwritten note
Describe the contents of this technical diagram
```

---

## Git Integration

### Daily Git Workflow

```bash
# Start of day
git pull

# After making changes
git status                    # See what changed
git add .                     # Stage all changes
git commit -m "vault backup: $(date +'%Y-%m-%d %H:%M:%S')"
git push
```

### Common Git Commands

```bash
# View recent commits
git log --oneline -5

# See what changed in last commit
git show

# Undo uncommitted changes to a file
git checkout -- filename.md

# View differences before committing
git diff

# Create a branch for experimental work
git checkout -b experiment-branch
```

**Note:** CLAUDE.md is intentionally not tracked by git (see `.gitignore`)

---

## Troubleshooting

### Scripts Not Found

**Error:** `Command not found: pnpm`

**Solution:**
```bash
# Install pnpm globally
npm install -g pnpm

# Or use in project directory
npm install
```

---

### Permission Denied

**Error:** `EACCES: permission denied`

**Solution:**
```bash
# Fix script permissions
chmod +x .scripts/*.sh

# Or run with explicit interpreter
bash .scripts/vault-stats.sh
```

---

### Firecrawl API Errors

**Error:** `401 Unauthorized`

**Solution:**
```bash
# Check if API key is set
echo $FIRECRAWL_API_KEY

# If empty, set it:
export FIRECRAWL_API_KEY="fc-your-key-here"

# Verify credits at https://firecrawl.dev/dashboard
```

---

### Gemini Vision Errors

**Error:** `API key not valid`

**Solution:**
```bash
# Check API key
echo $GEMINI_API_KEY

# Get new key from https://aistudio.google.com/apikey

# Set in environment
export GEMINI_API_KEY="your-key-here"
```

---

## Weekly Maintenance Routine

**Recommended Sunday workflow:**

```bash
# 1. Statistics review (5 min)
pnpm vault:stats

# 2. Process attachments (10 min)
pnpm attachments:list          # See what needs processing
pnpm attachments:recent        # Review recent additions
# Manually rename and organize files

# 3. Check for orphans (5 min)
pnpm attachments:orphans       # Find unreferenced files
# Review and delete/archive as needed

# 4. Git backup (2 min)
git add .
git commit -m "weekly backup: $(date +'%Y-%m-%d')"
git push
```

---

## Advanced Usage

### Custom Script Examples

**Find all notes from last week:**
```bash
find . -name "2025-12-2*.md" -type f
```

**Count notes by folder:**
```bash
for dir in 0*; do
  echo "$dir: $(find "$dir" -name "*.md" | wc -l) notes"
done
```

**Find broken wiki-links:**
```bash
grep -r "\[\[.*\]\]" --include="*.md" | \
grep -v "05_Attachments" | \
while read line; do
  # Extract link and check if target exists
  # (custom parsing logic here)
done
```

---

## Related Documentation

- **File Naming:** See `file-naming-conventions.md`
- **Attachment Organization:** See `05_Attachments/README.md`
- **Git Workflow:** See main `README.md`
- **PARA Method:** See `para-method-fundamentals.md`

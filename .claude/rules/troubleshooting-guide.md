# Troubleshooting Guide

**Quick solutions to common vault issues**

---

## Quick Diagnostic Checklist

When something isn't working:

1. **File not found?** → Check file naming and location
2. **Git issues?** → Verify .gitignore rules
3. **Scripts failing?** → Check environment variables and permissions
4. **Links broken?** → Verify @ reference syntax
5. **Attachments missing?** → Check 05_Attachments organization

---

## Claude Code Issues

### Claude Can't Find My Notes

**Symptoms:**
- Claude says "I don't see any notes about X"
- Claude asks "Where is this file?"
- Search returns no results

**Causes & Solutions:**

1. **Wrong directory context**
   ```bash
   # Check current directory
   pwd

   # Should be: /home/averypi/Documents/obs-averivendell

   # If wrong, navigate to vault root
   cd /home/averypi/Documents/obs-averivendell
   ```

2. **File permissions**
   ```bash
   # Check if Claude can read files
   ls -la [file-path]

   # Fix permissions if needed
   chmod 644 *.md
   chmod 755 */
   ```

3. **File extension wrong**
   - Files must be `.md` not `.txt` or `.markdown`
   - Check: `find . -name "*[filename]*"`

---

### Claude Code References Not Working

**Symptoms:**
- `@filename` shows as plain text
- Referenced files not loading
- "File not found" errors

**Solution - Use Correct Syntax:**

✅ **Correct:**
```markdown
See @.claude/rules/para-method-fundamentals.md
Details in @03_Resources/Guide.md
```

❌ **Wrong:**
```markdown
See [[para-method-fundamentals]]  # This is Obsidian syntax
See @para-method-fundamentals     # Missing path
```

**Path reference rules:**
- Relative paths from vault root
- Include `.md` extension
- No spaces in paths (use hyphens)

---

## Git Problems

### Git Ignoring CLAUDE.md Changes

**Symptoms:**
- `git add CLAUDE.md` fails
- Git says "path is ignored"

**Explanation:**
This is **intentional design** - CLAUDE.md is in `.gitignore` (line 12)

**Why:** CLAUDE.md is personal configuration (like .env files)

**Options:**

1. **Recommended: Keep as-is**
   - Personal configs stay local
   - No conflicts between users

2. **Force commit (not recommended):**
   ```bash
   git add -f CLAUDE.md
   git commit -m "Add personal CLAUDE.md"
   ```

---

### Git Conflicts When Pulling

**Symptoms:**
- `git pull` shows conflicts
- Merge conflicts in markdown files

**Solution:**
```bash
# See what's conflicted
git status

# For each conflicted file:
# Option 1: Keep your version
git checkout --ours [file]

# Option 2: Keep remote version
git checkout --theirs [file]

# Option 3: Manually edit to merge both
# Open file, resolve <<<< >>>> markers

# After resolving:
git add [file]
git commit -m "Resolve merge conflict"
```

**Prevention:**
```bash
# Always pull before starting work
git pull

# Commit frequently
git add .
git commit -m "Progress update"
git push
```

---

### Large Files Rejected

**Symptoms:**
- Git push fails with "file too large"
- Push rejected for files >50MB

**Solution:**
```bash
# Find large files
pnpm attachments:sizes

# Option 1: Remove from git (keep locally)
git rm --cached 05_Attachments/large-video.mp4
echo "large-video.mp4" >> .gitignore

# Option 2: Use Git LFS for large files
git lfs install
git lfs track "*.mp4"
git lfs track "*.zip"
git add .gitattributes
git commit -m "Configure Git LFS"
```

**Best practice:** Keep attachments under 10MB

---

## Attachment Management

### Gemini Vision Not Working

**Symptoms:**
- "API key not valid" error
- Image analysis fails
- Empty responses

**Diagnostic Steps:**

1. **Check API key is set:**
   ```bash
   echo $GEMINI_API_KEY
   ```

   If empty:
   ```bash
   # Get key from https://aistudio.google.com/apikey
   export GEMINI_API_KEY="your-key-here"

   # Add to shell config
   echo 'export GEMINI_API_KEY="your-key-here"' >> ~/.zshrc
   source ~/.zshrc
   ```

2. **Verify API key valid:**
   - Visit https://aistudio.google.com
   - Check dashboard for API status
   - Check quota limits

3. **Test with simple prompt:**
   ```
   Use gemini-vision to describe this image: [simple image path]
   ```

---

### Firecrawl Scraping Fails

**Symptoms:**
- 401 Unauthorized errors
- No credits remaining
- Rate limit errors

**Solutions:**

1. **Check API key:**
   ```bash
   echo $FIRECRAWL_API_KEY

   # Should start with "fc-"
   # If not set: export FIRECRAWL_API_KEY="fc-xxx"
   ```

2. **Check credits:**
   - Visit https://firecrawl.dev/dashboard
   - Verify remaining credits
   - Free tier: 300 credits

3. **Rate limiting:**
   - Wait 60 seconds between requests
   - Use batch mode for multiple URLs
   - Consider upgrading plan

4. **Website blocking:**
   - Some sites block scrapers
   - Try different URL
   - Use manual copy-paste as fallback

---

### Orphaned Attachments

**Symptoms:**
- `pnpm attachments:orphans` shows many files
- Unsure if files are needed

**Decision process:**

```bash
# For each orphaned file:
pnpm attachments:refs [filename]

# If 0 references:
# 1. Check if recently added (might not be linked yet)
pnpm attachments:recent

# 2. Check filename for context
ls -lh 05_Attachments/[filename]

# 3. Decide action:
```

**Actions:**
- **Recently added (< 7 days):** Keep, likely will be linked
- **Old (> 30 days) + unclear name:** Review in file, delete if not needed
- **Clear context but unlocked:** Move to appropriate subfolder in Organized/
- **Temporary/screenshot:** Delete if content is captured in notes

**Never auto-delete without review!**

---

## Script Problems

### `pnpm` Command Not Found

**Symptoms:**
```
bash: pnpm: command not found
```

**Solutions:**

1. **Install pnpm:**
   ```bash
   npm install -g pnpm

   # Or use in local project
   npm install
   npx pnpm vault:stats
   ```

2. **Use npm directly:**
   ```bash
   npm run vault:stats
   ```

---

### Script Permission Denied

**Symptoms:**
```
EACCES: permission denied
```

**Solution:**
```bash
# Make scripts executable
chmod +x .scripts/*.sh

# Or run with explicit interpreter
bash .scripts/vault-stats.sh
```

---

## File Organization Issues

### Can't Find Recent Notes

**Problem:** Created notes but can't locate them

**Solutions:**

1. **Search by date:**
   ```bash
   find . -name "2025-12-30*.md"
   ```

2. **Search by content:**
   ```bash
   grep -r "keyword" --include="*.md"
   ```

3. **Check Inbox first:**
   ```bash
   ls -lt 00_Inbox/ | head -10
   ```

4. **Use vault stats:**
   ```bash
   pnpm vault:stats
   ```

---

### Wrong Folder Structure

**Problem:** Folders don't match PARA structure

**Diagnostic:**
```bash
ls -d 0*
# Should show: 00_Inbox 01_Projects 02_Areas 03_Resources 04_Archive 05_Attachments 06_Metadata
```

**If missing folders:**
```bash
mkdir -p 00_Inbox
mkdir -p 01_Projects
mkdir -p 02_Areas
mkdir -p 03_Resources
mkdir -p 04_Archive
mkdir -p 05_Attachments
mkdir -p 06_Metadata
```

---

### Duplicate Files

**Problem:** Same content in multiple files

**Find duplicates:**
```bash
# Find files with same name (different dates)
find . -name "*Topic*" -type f

# Find files with similar content
# (requires fdupes: brew install fdupes)
fdupes -r .
```

**Resolution:**
1. Keep most recent version
2. Archive or delete older versions
3. Update links to point to canonical version

---

## Performance Issues

### Vault Responding Slowly

**Symptoms:**
- Claude Code slow to search
- File operations lag
- Long load times

**Diagnostic:**

1. **Check vault size:**
   ```bash
   du -sh /home/averypi/Documents/obs-averivendell
   pnpm vault:stats
   ```

2. **Find large files:**
   ```bash
   pnpm attachments:sizes
   find . -type f -size +10M
   ```

**Solutions:**

1. **Clean up large files:**
   - Compress images: `convert large.png -quality 85 compressed.png`
   - Remove old videos
   - Archive old projects

2. **Split large notes:**
   - If notes > 10,000 words, split into sections
   - Use @ references to connect

3. **Archive old content:**
   - Move completed projects to 04_Archive
   - Archive notes >6 months old if inactive

---

### Too Many Files

**Problem:** 500+ files slowing searches

**Solution:**
```bash
# Archive by age
find . -name "2024-*.md" -type f
# Review and move to 04_Archive/ if completed

# Split by project
# Move related notes into project subfolders
```

---

## Integration Issues

### Obsidian Can't Open Vault

**Problem:** Obsidian won't recognize vault

**Solution:**
1. In Obsidian: Settings → About → "Open another vault"
2. Select: `/home/averypi/Documents/obs-averivendell`
3. Trust vault when prompted

**If still failing:**
- Check `.obsidian/` folder exists
- Verify folder permissions: `ls -la .obsidian`

---

### Claude Desktop vs Claude Code

**Confusion:** Different Claude interfaces

**Clarification:**

| Feature | Claude Code (CLI) | Claude Desktop (App) |
|---------|-------------------|----------------------|
| **File access** | Direct | Needs MCP setup |
| **Vault integration** | Native | Via plugin |
| **Best for** | Note creation & editing | Chatting about notes |

**Recommendation:** Use Claude Code for vault work

---

## Emergency Recovery

### Accidentally Deleted Files

**If not committed:**
```bash
# Check git status
git status

# Restore deleted file
git checkout -- [filename]
```

**If committed and pushed:**
```bash
# Find commit before deletion
git log --oneline --all -- [filename]

# Restore from specific commit
git checkout [commit-hash] -- [filename]
```

---

### Corrupted CLAUDE.md

**Symptoms:**
- Claude behaves unexpectedly
- Syntax errors in CLAUDE.md

**Recovery:**
```bash
# Check if backup exists
ls -la 04_Archive/CLAUDE.md.backup*

# Restore from backup
cp 04_Archive/CLAUDE.md.backup_2025-12-30.md CLAUDE.md

# Or get from git history
git checkout HEAD~1 -- CLAUDE.md
```

---

### Vault Won't Sync

**Problem:** Changes not showing across devices

**Diagnostic:**
```bash
# Check git status
git status

# Check remote connection
git remote -v

# Try manual sync
git pull
git push
```

**If conflicts:**
```bash
# Stash local changes
git stash

# Pull updates
git pull

# Re-apply changes
git stash pop

# Resolve conflicts, then commit
```

---

## Prevention Best Practices

### Daily Habits

```bash
# Start of day
git pull

# End of day
git add .
git commit -m "daily backup: $(date +'%Y-%m-%d')"
git push
```

### Weekly Habits

```bash
# Every Sunday
pnpm vault:stats              # Review statistics
pnpm attachments:list         # Process attachments
pnpm attachments:orphans      # Clean up unreferenced files
git log --oneline -10         # Review recent changes
```

### Monthly Habits

```bash
# Review folder sizes
du -sh 0*

# Archive completed projects
# Move 01_Projects/[completed] to 04_Archive/

# Clean up Inbox
# Process any notes older than 2 weeks

# Check for duplicates
# Search for similar note titles
```

---

## Getting Help

### Check Documentation First

1. **This guide** - Common issues
2. **@.claude/rules/** - Detailed rules
3. **Folder READMEs** - Specific workflows
4. **Main README.md** - Setup and overview

### Search Vault

```bash
# Search for keywords
grep -r "keyword" --include="*.md"

# Find related notes
find . -name "*topic*.md"
```

### Ask Claude Code

```
I'm having an issue with [describe problem].
Search my vault for any related troubleshooting notes.
```

---

## Related Resources

- **PARA Method:** @.claude/rules/para-method-fundamentals.md
- **File Naming:** @.claude/rules/file-naming-conventions.md
- **Helper Scripts:** @.claude/rules/helper-scripts-reference.md
- **Git Workflow:** See main README.md

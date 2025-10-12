# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is Emanuel Trandafir's personal GitHub profile repository containing:

- `/resume/` - Multiple versions of Emanuel's resume in PDF and DOCX formats
- `/site/` - MkDocs documentation site (technical blog with articles on software design and testing)
  - `/site/docs/blog/` - Blog articles (Markdown)
  - `/site/docs/img/` - Images and assets
  - `/site/mkdocs.yml` - MkDocs configuration (uses Dracula theme)
- `README.md` - GitHub profile README showcasing Emanuel's work as a Software Craftsman

## Documentation Site Commands

The `site/` directory contains a MkDocs documentation site that can be run using Docker:

```bash
cd site
docker-compose up
```

This will:
- Install MkDocs and the mkdocs-dracula-theme package
- Serve the documentation site at http://localhost:8000
- Auto-reload when Markdown files or configuration changes

To run MkDocs commands directly (if you have Python/MkDocs installed):
```bash
cd site
mkdocs serve    # Run development server
mkdocs build    # Build static site
```

## Repository Purpose

This is primarily a personal profile repository used to:
- Host Emanuel's resume files
- Showcase his technical writing and expertise through blog articles
- Provide a technical blog/portfolio site built with MkDocs
- Serve as his GitHub profile README

The repository focuses on content creation (blog posts, resume updates) rather than complex development workflows. When adding new blog posts:
1. Create a new Markdown file in `/site/docs/blog/`
2. Add images to `/site/docs/img/` if needed
3. Update the `nav` section in `/site/mkdocs.yml` to include the new post

## Pre-Commit Article Review

A Git pre-commit hook automatically prompts you to review blog articles with Claude before committing changes.

**Setup:**

Run the installation script (only needed once):

```bash
# Using Git Bash (recommended for Windows)
bash .githooks/install.sh

# OR using PowerShell (Windows)
powershell .githooks/install.ps1
```

**How It Works:**

1. You modify a blog article in `/site/docs/blog/`
2. You stage and try to commit: `git commit -m "Update article"`
3. The pre-commit hook detects the change and:
   - Generates a review prompt with the article content
   - Displays it in your terminal
   - Copies it to your clipboard (if possible)
4. You paste the prompt into Claude Code (this CLI) or Claude.ai
5. You review Claude's feedback
6. You confirm to proceed with the commit (or cancel to make changes)

**What Claude Reviews:**
- Technical accuracy of concepts and code examples
- Clarity and readability of explanations
- Article structure and flow
- Code syntax and best practices
- Consistency with Emanuel's writing style (simplicity, intentionality, design, testability)
- Grammar and spelling

**Benefits:**
- No extra API costs (uses your existing Claude access)
- Automatic trigger before commits
- Review happens locally in your workflow
- You control when to proceed

**Hook Files:**
- `.githooks/pre-commit` - The pre-commit hook script
- `.githooks/install.sh` - Installation script for Unix/Git Bash
- `.githooks/install.ps1` - Installation script for PowerShell
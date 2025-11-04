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
4. Add the article to the appropriate tag sections in `/site/docs/index.md`

## Article Formatting Guidelines

When writing or editing blog articles, follow these formatting conventions:

### Method and Class Name Formatting
- **Method names**: Use italics with parentheses: _methodName()_
  - Examples: _get()_, _orElseThrow()_, _map()_, _flatMap()_, _ifPresent()_
- **Class names**: Use italics: _ClassName_
  - Examples: _Optional_, _Account_, _String_
- **Special syntax/operators**: Use backticks: `operator`
  - Examples: `?:`, `!!`, `?.`, `->>`, `?`

### Examples
- ❌ Incorrect: "The `Optional` class provides the `get()` method"
- ✅ Correct: "The _Optional_ class provides the _get()_ method"

- ❌ Incorrect: "Use the `?:` Elvis Operator or the _!!_ operator"
- ✅ Correct: "Use the `?:` Elvis Operator or the `!!` operator"

This ensures consistency across all technical articles and improves readability by clearly distinguishing between method/class references and syntax elements.

## Automated Article Review

A GitHub Actions workflow automatically reviews new/modified blog articles using Claude AI when you create a pull request.

**Setup Requirements:**
1. Add `ANTHROPIC_API_KEY` as a GitHub repository secret:
   - Go to Repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key from https://console.anthropic.com/

**How It Works:**
- The workflow triggers automatically when you push changes to `.md` files in `/site/docs/blog/` on a PR
- Claude reviews the article for technical accuracy, clarity, code quality, structure, and consistency
- Review feedback is posted as a PR comment

**What Claude Reviews:**
- Technical accuracy of concepts and code examples
- Clarity and readability of explanations
- Article structure and flow
- Code syntax and best practices
- Consistency with Emanuel's writing style (simplicity, intentionality, design, testability)
- Grammar and spelling

**Workflow Files:**
- `.github/workflows/review-article.yml` - GitHub Actions workflow
- `.github/workflows/scripts/review-article.js` - Review script that calls Claude API
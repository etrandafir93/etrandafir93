# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is Emanuel Trandafir's personal GitHub profile repository containing:

- `/resume/` - Multiple versions of Emanuel's resume in PDF and DOCX formats
- `/site/` - MkDocs documentation site with minimal content
- `README.md` - GitHub profile README showcasing Emanuel's work as a Software Craftsman

## Documentation Site Commands

The `site/` directory contains a MkDocs documentation site that can be run using Docker:

```bash
cd site
docker-compose up
```

This will:
- Install MkDocs and the Dracula theme 
- Serve the documentation site at http://localhost:8000
- Auto-reload when files change

To run MkDocs commands directly (if you have Python/MkDocs installed):
```bash
cd site
mkdocs serve    # Run development server
mkdocs build    # Build static site
```

## Repository Purpose

This is primarily a personal profile repository used to:
- Host Emanuel's resume files
- Showcase his technical writing and expertise
- Provide a simple documentation site structure
- Serve as his GitHub profile README

The repository focuses on content rather than complex development workflows.
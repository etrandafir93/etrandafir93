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

### Semantic Line Breaks

**ALWAYS use semantic line breaks when writing Markdown.**
Learn more at: https://sembr.org/

Semantic line breaks structure prose at meaningful boundaries
without affecting rendered output.
This makes content easier to author,
edit,
and read in source.

**Rules:**
- Break after sentences (periods, exclamation marks, question marks)
- Break after clauses (commas, semicolons, colons, em dashes)
- Break around lists
- Keep lines under 80 characters when possible
- Line breaks MUST NOT alter the final rendered output

**Example:**

```markdown
In this article,
we'll explore how to combine JUnit5's powerful features
with Behavior Driven Development principles
to write expressive,
maintainable tests.
```

Instead of:

```markdown
In this article, we'll explore how to combine JUnit5's powerful features with Behavior Driven Development principles to write expressive, maintainable tests.
```

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

## How to Add New Articles

This section provides detailed step-by-step instructions for adding new blog articles.

### Step 1: Create the Article File

1. Create a new Markdown file in `/site/docs/blog/` with a descriptive filename (use kebab-case)
   - Example: `unleash-junit5-bdd.md`

2. Follow this structure:

```markdown
# Article Title

*Published: Month DD, YYYY*

[`#tag1`](/#tag1) [`#tag2`](/#tag2) [`#tag3`](/#tag3) `#tag4`

Article introduction paragraph...

## Section Heading

Content...

### Subsection

More content...

## Conclusion

Closing thoughts...
```

### Step 2: Format the Content

Follow the formatting conventions described in the "Article Formatting Guidelines" section above.

**Additional formatting rules:**

#### Images
- Place images in `/site/docs/img/`
- Reference them using: `![description](../img/filename.png)`

#### Code Blocks
Use triple backticks with language identifier:

````markdown
```java
public class Example {
    // code here
}
```
````

#### Tags
- First 3-4 tags should be clickable links: `[`#tag`](/#tag)`
- Additional tags can be plain: `` `#tag` ``
- Common tags: `#testing`, `#design`, `#functional-programming`, `#debugging`, `#oss`, `#kafka`, `#oop`, `#books`, `#java`, `#kotlin`, `#spring`

### Step 3: Update Navigation (mkdocs.yml)

Add the article to the `nav` section in `/site/mkdocs.yml`:

```yaml
nav:
  - "--- About Me ---": index.md
  - "Article Title": blog/filename.md
  - "Previous Article": blog/previous-article.md
  # ... other articles
```

**Important**: Add new articles near the top (after the "About Me" line) as they're listed in reverse chronological order.

### Step 4: Update Tag Sections (index.md)

In `/site/docs/index.md`:

#### 4a. Update Tag Counter Buttons
Find the tag container section and update the counters:

```html
<div class="tag-container">
  <button class="tag-chip" onclick="showArticles('design')">#design (6)</button>
  <button class="tag-chip" onclick="showArticles('testing')">#testing (4)</button>
  <!-- Update the number in parentheses for each affected tag -->
</div>
```

#### 4b. Add Article to Tag Sections
For each tag the article uses, add it to the corresponding section:

```html
<div id="testing-articles" class="articles-container">
  <ul>
    <li><a href="blog/new-article/">New Article Title</a></li>
    <li><a href="blog/existing-article/">Existing Article</a></li>
    <!-- ... other articles -->
  </ul>
</div>
```

**Important**: Add new articles at the top of each tag section list (most recent first).

#### 4c. Create New Tag Section (if needed)
If introducing a new tag:

1. Add the button to the tag container:
```html
<button class="tag-chip" onclick="showArticles('newtag')">#newtag (1)</button>
```

2. Create the articles container section:
```html
<div id="newtag-articles" class="articles-container">
  <ul>
    <li><a href="blog/article-with-new-tag/">Article Title</a></li>
  </ul>
</div>
```

### Step 5: Test Locally

Run the MkDocs development server to preview:

```bash
cd site
docker-compose up
```

Visit `http://localhost:8000` and verify:
- ✅ Article appears in navigation
- ✅ Article content renders correctly
- ✅ Tag links work and show/hide article lists
- ✅ Tag counters are accurate
- ✅ Images load properly
- ✅ Code blocks have syntax highlighting

### Quick Checklist for Adding Articles

When adding a new article, ensure:

- [ ] Article file created in `/site/docs/blog/`
- [ ] Formatting follows conventions (italics for methods/classes, backticks for operators)
- [ ] Images (if any) added to `/site/docs/img/`
- [ ] Article added to navigation in `/site/mkdocs.yml`
- [ ] Tag counters updated in `/site/docs/index.md`
- [ ] Article added to all relevant tag sections in `/site/docs/index.md`
- [ ] New tag sections created (if introducing new tags)
- [ ] Tested locally with `docker-compose up`

### Common Mistakes to Avoid

- ❌ Forgetting to update tag counters
- ❌ Not adding article to all its tag sections
- ❌ Using wrong formatting for method/class names
- ❌ Adding article to wrong position in navigation (should be near top)
- ❌ Broken image paths (remember `../img/` not `/img/`)
- ❌ Not testing locally before committing
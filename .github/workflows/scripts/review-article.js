#!/usr/bin/env node

const fs = require('fs');
const https = require('https');

// Configuration from environment variables
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const PR_NUMBER = process.env.PR_NUMBER;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const COMMIT_SHA = process.env.COMMIT_SHA;

// Parse changed files from command line argument
const changedFiles = JSON.parse(process.argv[2] || '[]');

if (!ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY is not set');
  process.exit(1);
}

if (!GITHUB_TOKEN || !PR_NUMBER || !REPO_OWNER || !REPO_NAME) {
  console.error('Error: Required GitHub environment variables are not set');
  process.exit(1);
}

if (changedFiles.length === 0) {
  console.log('No blog articles to review');
  process.exit(0);
}

// Review prompt for Claude
const REVIEW_PROMPT = `You are reviewing a technical blog article written by Emanuel Trandafir, a Software Craftsman who writes about software design, testing, and engineering best practices.

Please review the article for:

1. **Technical Accuracy**: Are the code examples correct? Are the concepts explained accurately?
2. **Clarity & Readability**: Is the content easy to understand? Are explanations clear?
3. **Structure & Flow**: Does the article have a logical flow? Are sections well-organized?
4. **Code Quality**: If there are code examples:
   - Are they syntactically correct?
   - Do they follow best practices?
   - Are they well-commented where needed?
5. **Consistency**: Does the style match Emanuel's other articles (focus on simplicity, intentionality, design, testability)?
6. **Grammar & Spelling**: Any language issues?

Please provide:
- An overall assessment (2-3 sentences)
- Specific feedback organized by category
- Line-specific suggestions if applicable (format: "Line X: [suggestion]")

Be constructive and specific. Focus on improvements that would make the article more valuable to readers.`;

// Function to make HTTPS requests (promisified)
function httpsRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ statusCode: res.statusCode, body: body });
        } else {
          reject(new Error(`Request failed with status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// Call Claude API to review article
async function reviewWithClaude(articleContent, fileName) {
  console.log(`Reviewing ${fileName} with Claude...`);

  const payload = JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `${REVIEW_PROMPT}

---

**Article File**: ${fileName}

**Content**:

${articleContent}`
      }
    ]
  });

  const options = {
    hostname: 'api.anthropic.com',
    port: 443,
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    }
  };

  const response = await httpsRequest(options, payload);
  const result = JSON.parse(response.body);

  if (result.content && result.content[0] && result.content[0].text) {
    return result.content[0].text;
  }

  throw new Error('Unexpected response format from Claude API');
}

// Post review comment to GitHub PR
async function postPRComment(body) {
  console.log('Posting review to GitHub PR...');

  const payload = JSON.stringify({ body });

  const options = {
    hostname: 'api.github.com',
    port: 443,
    path: `/repos/${REPO_OWNER}/${REPO_NAME}/issues/${PR_NUMBER}/comments`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Claude-Article-Reviewer'
    }
  };

  await httpsRequest(options, payload);
  console.log('Review posted successfully');
}

// Main execution
async function main() {
  try {
    let allReviews = '## Article Review by Claude\n\n';

    for (const file of changedFiles) {
      console.log(`Processing ${file}...`);

      // Read the article content
      const content = fs.readFileSync(file, 'utf-8');

      // Get review from Claude
      const review = await reviewWithClaude(content, file);

      // Append to all reviews
      allReviews += `### 📄 ${file}\n\n${review}\n\n---\n\n`;
    }

    // Add footer
    allReviews += '*This review was generated automatically by Claude via GitHub Actions.*';

    // Post combined review as PR comment
    await postPRComment(allReviews);

    console.log('All reviews completed successfully');
  } catch (error) {
    console.error('Error during review process:', error.message);
    process.exit(1);
  }
}

main();

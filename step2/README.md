# Step 2: AI-Powered Code Review CLI - Universal Repository Access

AI code review for ANY GitHub repository using OpenAI, Anthropic, or Google Gemini.

## Features

- Review PRs from any public GitHub repository
- Support for multiple AI providers with automatic fallback
- Batch review multiple PRs across different repositories
- Direct GitHub URL support
- JSON output format for automation

## Setup

1. Create `.env` file with your API keys:
```bash
GITHUB_TOKEN=your_github_token
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
```

2. You only need to configure the AI providers you want to use.

## Usage

### Method 1: Traditional Command
```bash
deno task dev review facebook react 12345
```

### Method 2: Direct URL (NEW!)
```bash
deno task dev review-url https://github.com/microsoft/vscode/pull/12345
```

### Method 3: Batch Review (NEW!)
```bash
# Review multiple PRs with all configured providers
deno task dev review-batch \
  https://github.com/facebook/react/pull/27513 \
  https://github.com/microsoft/TypeScript/pull/56210 \
  https://github.com/vercel/next.js/pull/58000

# Use specific provider
deno task dev review-batch \
  https://github.com/rust-lang/rust/pull/117000 \
  https://github.com/golang/go/pull/63000 \
  -p openai

# Output as JSON for automation
deno task dev review-batch \
  https://github.com/denoland/deno/pull/20000 \
  https://github.com/nodejs/node/pull/45000 \
  -o json > reviews.json
```

## Examples

### Review Popular Open Source PRs

```bash
# Review a React PR with all providers
deno task dev review-url https://github.com/facebook/react/pull/27513

# Review with specific provider
deno task dev review-url https://github.com/microsoft/vscode/pull/195000 -p anthropic

# Batch review trending PRs
deno task dev review-batch \
  https://github.com/tensorflow/tensorflow/pull/60000 \
  https://github.com/pytorch/pytorch/pull/110000 \
  https://github.com/kubernetes/kubernetes/pull/120000 \
  -p openai,anthropic
```

## Provider Fallback

If one AI provider fails, the tool automatically tries the next available provider:
1. OpenAI (GPT-4)
2. Anthropic (Claude)
3. Google (Gemini)

## Output

Each review includes:
- Summary of changes
- Potential bugs or issues
- Security concerns
- Performance considerations
- Code quality suggestions
- Overall recommendation (APPROVE/REQUEST_CHANGES/COMMENT)

## Rate Limits

- GitHub API: 5,000 requests/hour (authenticated)
- OpenAI: Varies by plan
- Anthropic: Varies by plan
- Google: Varies by plan

## Automation

Use JSON output for CI/CD integration:
```bash
# Generate review report
deno task dev review-batch $(cat pr-list.txt) -o json > review-report.json

# Parse with jq
cat review-report.json | jq '.[] | select(.status == "success")'
```
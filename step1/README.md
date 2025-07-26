# Step 1: Basic GitHub CLI - Universal Repository Access

A CLI tool that can analyze pull requests from ANY public GitHub repository.

## Features

- Analyze any public GitHub repository PR
- Support for direct GitHub PR URLs
- Batch analysis of multiple PRs from different repositories
- Detailed PR information including files changed and full diff

## Setup

1. Create a GitHub Personal Access Token:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` scope (or `public_repo` for public repos only)

2. Create `.env` file:
```bash
GITHUB_TOKEN=your_github_token_here
```

## Usage

### Method 1: Traditional Command
```bash
deno task dev analyze microsoft typescript 50000
```

### Method 2: Direct URL (NEW!)
```bash
deno task dev analyze-url https://github.com/facebook/react/pull/12345
```

### Method 3: Batch Analysis (NEW!)
```bash
deno task dev analyze-batch \
  https://github.com/microsoft/vscode/pull/123 \
  https://github.com/facebook/react/pull/456 \
  https://github.com/denoland/deno/pull/789
```

## Examples

Analyze PRs from popular repositories:
```bash
# Single PR from React
deno task dev analyze-url https://github.com/facebook/react/pull/27513

# Multiple PRs from different projects
deno task dev analyze-batch \
  https://github.com/microsoft/TypeScript/pull/56210 \
  https://github.com/vercel/next.js/pull/58000 \
  https://github.com/rust-lang/rust/pull/117000
```

## Output

The tool displays:
- PR title and author
- Branch information
- Files changed with additions/deletions
- Full diff output

## Token Permissions

- **Public repositories**: `public_repo` scope
- **Private repositories**: `repo` scope (full access)

## Rate Limits

- Authenticated requests: 5,000 per hour
- Consider using batch wisely to avoid hitting limits
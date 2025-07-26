# GitHub App Setup Guide

## Creating a GitHub App for Universal Repository Access

### 1. Create GitHub App

Go to GitHub Settings → Developer settings → GitHub Apps → New GitHub App

**Basic Information:**
- **GitHub App name**: AI Code Review Bot
- **Homepage URL**: https://your-domain.com
- **Webhook URL**: https://your-domain.com/webhooks/github (or use ngrok for testing)
- **Webhook secret**: Generate a strong secret and save it

### 2. Permissions

Set the following **Repository permissions**:
- **Contents**: Read
- **Issues**: Write
- **Pull requests**: Write
- **Metadata**: Read

### 3. Subscribe to Events

Check these webhook events:
- Pull request
- Pull request review comment
- Issue comment

### 4. Where can this GitHub App be installed?
- Choose "Any account" for universal access

### 5. Generate Private Key
- After creating, generate a private key
- Save as `private-key.pem` in your project

### 6. Install the App
- Go to the app's public page
- Click "Install"
- Choose repositories to grant access

## Environment Variables

Create `.env` file:
```bash
# GitHub App Configuration
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY_PATH=./private-key.pem
GITHUB_APP_WEBHOOK_SECRET=your-webhook-secret

# AI Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
```

## Testing with ngrok

For local development:
```bash
# Install ngrok
brew install ngrok

# Start your webhook server
deno task dev

# In another terminal, expose it
ngrok http 3000

# Update GitHub App webhook URL to the ngrok URL
```

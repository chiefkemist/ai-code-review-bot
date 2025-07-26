# AI Code Review Bot

A progressive GitHub App that provides automated code reviews using AI, built with [Probot](https://probot.github.io/) and [@ax-llm/ax](https://github.com/ax-llm/ax).

## Overview

This project demonstrates building an AI-powered code review bot through progressive steps, from basic HTTP clients to advanced DSPy-powered AI workflows.

## Steps

- **Step 1-2**: Basic AI providers with manual HTTP clients
- **Step 3**: GitHub App integration using Probot for webhook handling
- **Step 4**: Enhanced with @ax-llm/ax DSPy signatures for structured AI responses

## Key Features

- 🤖 **Multi-Provider AI**: Supports OpenAI, Anthropic, and Google Gemini
- 📝 **Structured Reviews**: Uses DSPy signatures for consistent output format
- ⚡ **Webhook-Driven**: Real-time PR review via GitHub webhooks
- 🔄 **Provider Fallback**: Automatic failover between AI providers
- 🛡️ **Production Ready**: Multi-tenant architecture with web dashboard

## Technologies

- **[Probot](https://probot.github.io/)**: GitHub App framework for webhook handling
- **[@ax-llm/ax](https://github.com/ax-llm/ax)**: DSPy for TypeScript - structured AI workflows
- **Deno**: Modern JavaScript runtime
- **React Router**: Web interface (steps 5-6)

## Quick Start

1. Set up environment variables for AI providers
2. Run any step: `deno run --allow-all step3/probot-runner.ts`
3. Configure GitHub webhook to point to your server

Each step is self-contained and demonstrates different aspects of building production AI applications. 
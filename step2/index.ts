#!/usr/bin/env -S deno run --allow-net --allow-env --allow-read
import { Command } from "commander";
import { load } from "@std/dotenv";
import { OpenAIProvider, AnthropicProvider, GeminiProvider } from "./llm-providers.ts";

await load({ export: true });

const program = new Command();

interface PullRequestFile {
  filename: string;
  additions: number;
  deletions: number;
  status: string;
}

interface LLMProvider {
  reviewCode(prompt: string): Promise<string>;
}

class GitHubAPI {
  private token: string;
  private baseURL = "https://api.github.com";

  constructor(token: string) {
    this.token = token;
  }

  async makeRequest<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "AI-Code-Review-Bot",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json() as Promise<T>;
  }

  getPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<PullRequestFile[]> {
    return this.makeRequest<PullRequestFile[]>(`/repos/${owner}/${repo}/pulls/${prNumber}/files`);
  }

  async getPullRequestDiff(owner: string, repo: string, prNumber: number) {
    const response = await fetch(
      `${this.baseURL}/repos/${owner}/${repo}/pulls/${prNumber}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: "application/vnd.github.v3.diff",
          "User-Agent": "AI-Code-Review-Bot",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    return response.text();
  }
}

class AICodeReviewer {
  private providers: Record<string, LLMProvider> = {};

  constructor() {
    // const openaiKey = Deno.env.get("OPENAI_API_KEY");
    const googleKey = Deno.env.get("GOOGLE_API_KEY");
    // const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");

    // if (openaiKey) {
    //   this.providers.openai = new OpenAIProvider(openaiKey);
    // }

    if (googleKey) {
      this.providers.gemini = new GeminiProvider(googleKey);
    }

    // if (anthropicKey) {
    //   this.providers.anthropic = new AnthropicProvider(anthropicKey);
    // }
  }

  async reviewWithProvider(provider: string, diff: string, files: PullRequestFile[]) {
    const prompt = this.buildReviewPrompt(diff, files);

    try {
      return await this.providers[provider].reviewCode(prompt);
    } catch (error: unknown) {
      console.error(`❌ ${provider} failed:`, error instanceof Error ? error.message : String(error));
      return null;
    }
  }

  buildReviewPrompt(diff: string, files: PullRequestFile[]) {
    const fileList = files
      .map((f) => `- ${f.filename} (+${f.additions}, -${f.deletions})`)
      .join("\n");

    return `Please review the following code changes:

FILES MODIFIED:
${fileList}

DIFF:
${diff}

Please provide:
1. Summary of changes
2. Potential bugs or issues
3. Security concerns
4. Performance considerations
5. Code quality suggestions
6. Overall recommendation (APPROVE/REQUEST_CHANGES/COMMENT)`;
  }

  async reviewPR(
    owner: string,
    repo: string,
    prNumber: number,
    selectedProviders: string[] = []
  ) {
    const github = new GitHubAPI(Deno.env.get("GITHUB_TOKEN") || "");

    console.log(`\n🤖 AI Code Review for PR #${prNumber} in ${owner}/${repo}\n`);

    const files = await github.getPullRequestFiles(owner, repo, prNumber);
    const diff = await github.getPullRequestDiff(owner, repo, prNumber);

    const providersToUse =
      selectedProviders.length > 0
        ? selectedProviders
        : Object.keys(this.providers);

    for (const provider of providersToUse) {
      if (!this.providers[provider]) {
        console.log(`⚠️  ${provider} not configured, skipping...`);
        continue;
      }

      console.log(`\n🔍 ${provider.toUpperCase()} Review:`);
      console.log("=".repeat(50));

      const review = await this.reviewWithProvider(provider, diff, files);

      if (review) {
        console.log(review);
      } else {
        console.log(`❌ Failed to get review from ${provider}`);
      }

      console.log("\n");
    }
  }
}

async function reviewPR(
  owner: string,
  repo: string,
  prNumber: string,
  options: { providers?: string }
) {
  const reviewer = new AICodeReviewer();
  const providers = options.providers ? options.providers.split(",") : [];

  try {
    await reviewer.reviewPR(owner, repo, parseInt(prNumber), providers);
  } catch (error: unknown) {
    console.error("❌ Error:", error instanceof Error ? error.message : String(error));
    Deno.exit(1);
  }
}

program
  .name("ai-code-review-cli")
  .description("AI-powered code review CLI tool")
  .version("1.0.0");

program
  .command("review")
  .description("Review a pull request with AI")
  .argument("<owner>", "Repository owner")
  .argument("<repo>", "Repository name")
  .argument("<pr-number>", "Pull request number")
  .option(
    "-p, --providers <providers>",
    "Comma-separated list of providers (openai,anthropic,gemini)"
  )
  .action(reviewPR);

program
  .command("review-url")
  .description("Review a PR from its GitHub URL")
  .argument("<url>", "GitHub PR URL")
  .option(
    "-p, --providers <providers>",
    "Comma-separated list of providers (openai,anthropic,gemini)"
  )
  .action(async (url: string, options: { providers?: string }) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);
    if (!match) {
      console.error("❌ Invalid GitHub PR URL");
      Deno.exit(1);
    }
    const [, owner, repo, prNumber] = match;
    await reviewPR(owner, repo, prNumber, options);
  });

program
  .command("review-batch")
  .description("Review multiple PRs from different repositories")
  .argument("<urls...>", "List of GitHub PR URLs")
  .option(
    "-p, --providers <providers>",
    "Comma-separated list of providers (openai,anthropic,gemini)"
  )
  .option(
    "-o, --output <format>",
    "Output format: console, json, markdown (default: console)"
  )
  .action(async (urls: string[], options: { providers?: string; output?: string }) => {
    const results = [];
    console.log(`\n🤖 Reviewing ${urls.length} pull requests with AI...\n`);
    
    for (const url of urls) {
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);
      if (!match) {
        console.error(`❌ Skipping invalid URL: ${url}`);
        continue;
      }
      
      const [, owner, repo, prNumber] = match;
      console.log(`\n${"=".repeat(60)}`);
      console.log(`🔍 Reviewing: ${owner}/${repo}#${prNumber}`);
      console.log(`${"=".repeat(60)}\n`);
      
      try {
        await reviewPR(owner, repo, prNumber, options);
        results.push({ url, status: "success" });
      } catch (error) {
        console.error(`❌ Failed to review ${url}`);
        results.push({ url, status: "failed", error: error instanceof Error ? error.message : String(error) });
      }
    }
    
    if (options.output === "json") {
      console.log(JSON.stringify(results, null, 2));
    }
  });

program.parse();
#!/usr/bin/env -S deno run --allow-net --allow-env --allow-read
import { Command } from "commander";
import { load } from "@std/dotenv";

await load({ export: true });

const program = new Command();

interface PullRequest {
  title: string;
  user: {
    login: string;
  };
  head: {
    ref: string;
  };
  base: {
    ref: string;
  };
  state: string;
  additions: number;
  deletions: number;
}

interface PullRequestFile {
  status: string;
  filename: string;
  additions: number;
  deletions: number;
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

  getPullRequest(owner: string, repo: string, prNumber: number): Promise<PullRequest> {
    return this.makeRequest<PullRequest>(`/repos/${owner}/${repo}/pulls/${prNumber}`);
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

async function analyzePR(owner: string, repo: string, prNumber: string) {
  const github = new GitHubAPI(Deno.env.get("GITHUB_TOKEN") || "");

  try {
    console.log(`\n🔍 Analyzing PR #${prNumber} in ${owner}/${repo}\n`);

    // Get PR details
    const pr = await github.getPullRequest(owner, repo, parseInt(prNumber));
    console.log(`📋 PR Title: ${pr.title}`);
    console.log(`👤 Author: ${pr.user.login}`);
    console.log(`🌿 Branch: ${pr.head.ref} → ${pr.base.ref}`);
    console.log(`📊 Status: ${pr.state}`);
    console.log(`➕ Additions: ${pr.additions} | ➖ Deletions: ${pr.deletions}`);

    // Get changed files
    const files = await github.getPullRequestFiles(owner, repo, parseInt(prNumber));
    console.log(`\n📁 Changed Files (${files.length}):`);
    files.forEach((file) => {
      console.log(`  ${file.status.toUpperCase()}: ${file.filename}`);
      console.log(`    +${file.additions} -${file.deletions}`);
    });

    // Get diff
    const diff = await github.getPullRequestDiff(owner, repo, parseInt(prNumber));
    console.log(`\n📝 Full Diff:\n`);
    console.log(diff);
  } catch (error: unknown) {
    console.error("❌ Error:", error instanceof Error ? error.message : String(error));
    Deno.exit(1);
  }
}

program
  .name("github-pr-analyzer")
  .description("CLI tool to analyze GitHub pull requests")
  .version("1.0.0");

program
  .command("analyze")
  .description("Analyze a specific pull request")
  .argument("<owner>", "Repository owner")
  .argument("<repo>", "Repository name")
  .argument("<pr-number>", "Pull request number")
  .action(analyzePR);

program
  .command("analyze-url")
  .description("Analyze a PR from its GitHub URL")
  .argument("<url>", "GitHub PR URL (e.g., https://github.com/owner/repo/pull/123)")
  .action(async (url: string) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);
    if (!match) {
      console.error("❌ Invalid GitHub PR URL format");
      console.error("Expected format: https://github.com/owner/repo/pull/123");
      Deno.exit(1);
    }
    const [, owner, repo, prNumber] = match;
    await analyzePR(owner, repo, prNumber);
  });

program
  .command("analyze-batch")
  .description("Analyze multiple PRs from different repositories")
  .argument("<urls...>", "List of GitHub PR URLs")
  .action(async (urls: string[]) => {
    console.log(`\n🔄 Analyzing ${urls.length} pull requests...\n`);
    
    for (const url of urls) {
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);
      if (!match) {
        console.error(`❌ Skipping invalid URL: ${url}`);
        continue;
      }
      
      const [, owner, repo, prNumber] = match;
      console.log(`\n${"=".repeat(60)}`);
      console.log(`Analyzing: ${owner}/${repo}#${prNumber}`);
      console.log(`${"=".repeat(60)}\n`);
      
      try {
        await analyzePR(owner, repo, prNumber);
      } catch (error) {
        console.error(`❌ Failed to analyze ${url}:`, error instanceof Error ? error.message : String(error));
      }
    }
  });

program.parse();
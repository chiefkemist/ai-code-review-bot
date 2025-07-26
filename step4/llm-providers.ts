import { AxAI, AxGen, AxAIGoogleGeminiModel } from "@ax-llm/ax";

// Define the signature for code review using the proper DSP signature format
// Based on step3 requirements: summary, bugs/issues, security concerns, assessment
const codeReviewSignature = `
  diff:string "Code diff to review",
  files:string "List of modified files with change counts" -> 
  summary:string "Brief summary of changes",
  issues:string "Any bugs or issues found", 
  security:string "Security concerns if any",
  assessment:class "APPROVE,REQUEST_CHANGES,COMMENT" "Overall assessment"
`;

export interface LLMProvider {
  reviewCode(prompt: string): Promise<string>;
}

export class AxOpenAIProvider implements LLMProvider {
  private ai: AxAI;
  private gen: AxGen;

  constructor(apiKey: string) {
    this.ai = new AxAI({
      name: "openai",
      apiKey: apiKey,
    });
    
    this.gen = new AxGen(codeReviewSignature);
  }

  async reviewCode(prompt: string): Promise<string> {
    // Parse the prompt to extract diff and files info
    const diffMatch = prompt.match(/DIFF:\s*\n([\s\S]*?)(?:\n\nPlease provide:|$)/);
    const filesMatch = prompt.match(/FILES MODIFIED:\s*\n([\s\S]*?)\n\nDIFF:/);
    
    const diff = diffMatch ? diffMatch[1].trim() : prompt;
    const files = filesMatch ? filesMatch[1].trim() : "No file information provided";

    try {
      const result = await this.gen.forward(this.ai, {
        diff,
        files
      });

      // Format the response according to step3 requirements
      return this.formatResponse(result);
    } catch (error) {
      throw new Error(`OpenAI provider error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private formatResponse(result: any): string {
    return `**Summary:** ${result.summary}

**Issues Found:** ${result.issues}

**Security Concerns:** ${result.security}

**Assessment:** ${result.assessment}`;
  }
}

export class AxAnthropicProvider implements LLMProvider {
  private ai: AxAI;
  private gen: AxGen;

  constructor(apiKey: string) {
    this.ai = new AxAI({
      name: "anthropic",
      apiKey: apiKey,
    });
    
    this.gen = new AxGen(codeReviewSignature);
  }

  async reviewCode(prompt: string): Promise<string> {
    // Parse the prompt to extract diff and files info
    const diffMatch = prompt.match(/DIFF:\s*\n([\s\S]*?)(?:\n\nPlease provide:|$)/);
    const filesMatch = prompt.match(/FILES MODIFIED:\s*\n([\s\S]*?)\n\nDIFF:/);
    
    const diff = diffMatch ? diffMatch[1].trim() : prompt;
    const files = filesMatch ? filesMatch[1].trim() : "No file information provided";

    try {
      const result = await this.gen.forward(this.ai, {
        diff,
        files
      });

      return this.formatResponse(result);
    } catch (error) {
      throw new Error(`Anthropic provider error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private formatResponse(result: any): string {
    return `**Summary:** ${result.summary}

**Issues Found:** ${result.issues}

**Security Concerns:** ${result.security}

**Assessment:** ${result.assessment}`;
  }
}

export class AxGeminiProvider implements LLMProvider {
  private ai: AxAI;
  private gen: AxGen;

  constructor(apiKey: string) {
    this.ai = new AxAI({
      name: "google-gemini",
      models: [
        {
          key: "quick" as const,
          model: AxAIGoogleGeminiModel.Gemini20Flash,
          description: "Quick responses",
        },
        {
          key: "advanced" as const,
          model: AxAIGoogleGeminiModel.Gemini25Pro,
          description: "Advanced reasoning",
        },
      ],
      apiKey: apiKey,
    });
    
    this.gen = new AxGen(codeReviewSignature);
  }

  async reviewCode(prompt: string): Promise<string> {
    // Parse the prompt to extract diff and files info
    const diffMatch = prompt.match(/DIFF:\s*\n([\s\S]*?)(?:\n\nPlease provide:|$)/);
    const filesMatch = prompt.match(/FILES MODIFIED:\s*\n([\s\S]*?)\n\nDIFF:/);
    
    const diff = diffMatch ? diffMatch[1].trim() : prompt;
    const files = filesMatch ? filesMatch[1].trim() : "No file information provided";

    try {
      const result = await this.gen.forward(this.ai, {
        diff,
        files
      });

      return this.formatResponse(result);
    } catch (error) {
      throw new Error(`Gemini provider error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private formatResponse(result: any): string {
    return `**Summary:** ${result.summary}

**Issues Found:** ${result.issues}

**Security Concerns:** ${result.security}

**Assessment:** ${result.assessment}`;
  }
}

// Keep backward compatibility with the old names
export const OpenAIProvider = AxOpenAIProvider;
export const AnthropicProvider = AxAnthropicProvider;
export const GeminiProvider = AxGeminiProvider;
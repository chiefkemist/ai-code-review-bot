export class OpenAIProvider {
  private apiKey: string;
  private baseURL = "https://api.openai.com/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async reviewCode(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert code reviewer. Analyze the provided code changes and provide constructive feedback focusing on bugs, performance, security, and best practices.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

export class AnthropicProvider {
  private apiKey: string;
  private baseURL = "https://api.anthropic.com/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async reviewCode(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseURL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        system:
          "You are an expert code reviewer. Analyze the provided code changes and provide constructive feedback focusing on bugs, performance, security, and best practices.",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }
}

export class GeminiProvider {
  private apiKey: string;
  private baseURL = "https://generativelanguage.googleapis.com/v1beta";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async reviewCode(prompt: string): Promise<string> {
    const response = await fetch(
      `${this.baseURL}/models/gemini-2.5-pro:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": this.apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert code reviewer. Analyze the provided code changes and provide constructive feedback focusing on bugs, performance, security, and best practices.\n\n${prompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 8000, // Increased to account for thinking tokens
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }
}
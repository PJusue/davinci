import Anthropic from "@anthropic-ai/sdk";
import { CloudProvider, IaCFormat, ParsedInfrastructure } from "@/types/infrastructure";

export class ClaudeAPI {
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model?: string) {
    this.client = new Anthropic({
      apiKey: apiKey,
    });
    this.model = model || "claude-3-5-sonnet-20241022";
  }

  async analyzeText(text: string, provider: CloudProvider): Promise<ParsedInfrastructure> {
    const systemPrompt = `You are an expert cloud infrastructure architect and DevOps engineer. Your task is to analyze natural language descriptions of infrastructure and extract structured information about the resources, networking, and security requirements.

Respond ONLY with a valid JSON object matching this structure:
{
  "provider": "${provider}",
  "resources": [
    {
      "type": "resource_type",
      "name": "resource_name",
      "properties": {},
      "dependencies": []
    }
  ],
  "network": {
    "vpcs": [],
    "subnets": [],
    "securityGroups": []
  },
  "security": {
    "encryption": true/false,
    "publicAccess": true/false,
    "authentication": "type"
  }
}

Be specific about resource types for ${provider}. Extract all mentioned infrastructure components, network configurations, and security requirements.`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Analyze this infrastructure description and extract structured information:\n\n${text}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") {
      try {
        const parsed = JSON.parse(content.text);
        return parsed as ParsedInfrastructure;
      } catch (error) {
        throw new Error("Failed to parse Claude response as JSON");
      }
    }

    throw new Error("Unexpected response format from Claude");
  }

  async analyzeImage(imageData: string, provider: CloudProvider): Promise<ParsedInfrastructure> {
    const systemPrompt = `You are an expert at reading architecture diagrams and converting them into structured infrastructure definitions. Analyze the provided architecture diagram and extract all infrastructure components, their relationships, and configurations.

Respond ONLY with a valid JSON object matching this structure:
{
  "provider": "${provider}",
  "resources": [
    {
      "type": "resource_type",
      "name": "resource_name",
      "properties": {},
      "dependencies": []
    }
  ],
  "network": {
    "vpcs": [],
    "subnets": [],
    "securityGroups": []
  },
  "security": {
    "encryption": true/false,
    "publicAccess": true/false,
    "authentication": "type"
  }
}

Identify service icons, text labels, connection arrows, and network boundaries. Be specific about resource types for ${provider}.`;

    // Extract base64 data and media type
    const base64Match = imageData.match(/^data:(.+);base64,(.+)$/);
    if (!base64Match) {
      throw new Error("Invalid image data format");
    }

    const mediaType = base64Match[1] as "image/jpeg" | "image/png" | "image/gif" | "image/webp";
    const base64Data = base64Match[2];

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: "text",
              text: "Analyze this architecture diagram and extract all infrastructure components, their relationships, and configurations.",
            },
          ],
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") {
      try {
        const parsed = JSON.parse(content.text);
        return parsed as ParsedInfrastructure;
      } catch (error) {
        throw new Error("Failed to parse Claude response as JSON");
      }
    }

    throw new Error("Unexpected response format from Claude");
  }
}

export function getClaudeClient(apiKey?: string): ClaudeAPI {
  const key = apiKey || process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error("Anthropic API key not found");
  }
  return new ClaudeAPI(key, process.env.CLAUDE_MODEL);
}

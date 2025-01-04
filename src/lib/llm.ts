import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { PREFIX, EXAMPLE_CARDS } from "./prompts";
import { Card } from "./types";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type CardInput = {
  name: string;
  type?: string;
  rulesHint?: string;
};

function composePrompt(input: CardInput): string {
  const parts = [`Create a card named "${input.name}"`];

  if (input.type) {
    parts.push(`of type "${input.type}"`);
  }

  if (input.rulesHint) {
    parts.push(`with these hints about the rules: ${input.rulesHint}`);
  }

  return parts.join(" ");
}

async function createCardWithOpenAI(prompt: string): Promise<Card> {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `${PREFIX}\n\nExample cards:\n${EXAMPLE_CARDS}`,
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.9,
    max_tokens: 1000,
  });

  const data = JSON.parse(response.choices[0].message.content || "{}");
  return data as Card;
}

async function createCardWithAnthropic(prompt: string): Promise<Card> {
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    system: `${PREFIX}\n\nExample cards:\n${EXAMPLE_CARDS}`,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9,
    max_tokens: 1000,
  });

  const content = response.content[0];
  let jsonString: string;

  switch (content.type) {
    case "text":
      jsonString = content.text;
      break;
    case "tool_use":
      throw new Error("Unexpected tool use response from Anthropic");
    default:
      throw new Error("Unknown response type from Anthropic");
  }

  if (!jsonString) {
    throw new Error("Failed to get valid response from Anthropic");
  }

  return JSON.parse(jsonString) as Card;
}

export async function createCard(
  input: string | CardInput,
  provider: "openai" | "anthropic" = "anthropic"
): Promise<Card> {
  const prompt = typeof input === "string" ? input : composePrompt(input);
  console.log(prompt);

  return provider === "openai"
    ? createCardWithOpenAI(prompt)
    : createCardWithAnthropic(prompt);
}

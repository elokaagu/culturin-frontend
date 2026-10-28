import "server-only";

import { generateText, Output } from "ai";
import type { z } from "zod";

/** Claude via Vercel AI Gateway (OIDC in production), the same route the audience briefing uses. */
export const WRITER_MODEL = "anthropic/claude-sonnet-5.5";
export const CHECKER_MODEL = "anthropic/claude-sonnet-5.5";

/** Gateway list prices per million tokens, for the cost shown in the admin. */
const PRICE_PER_MTOK: Record<string, { input: number; output: number }> = {
  "anthropic/claude-sonnet-5.5": { input: 2, output: 10 },
};

export type LlmUsage = { inputTokens: number; outputTokens: number; costUsd: number };

export async function structured<T extends z.ZodType>(opts: {
  model: string;
  system: string;
  prompt: string;
  schema: T;
  maxOutputTokens?: number;
}): Promise<{ output: z.infer<T>; usage: LlmUsage }> {
  const result = await generateText({
    model: opts.model,
    system: opts.system,
    prompt: opts.prompt,
    output: Output.object({ schema: opts.schema }),
    maxOutputTokens: opts.maxOutputTokens ?? 16_000,
    maxRetries: 2,
  });
  const inputTokens = result.totalUsage.inputTokens ?? 0;
  const outputTokens = result.totalUsage.outputTokens ?? 0;
  const price = PRICE_PER_MTOK[opts.model] ?? { input: 3, output: 15 };
  const costUsd = (inputTokens * price.input + outputTokens * price.output) / 1_000_000;
  return { output: result.output as z.infer<T>, usage: { inputTokens, outputTokens, costUsd } };
}

import { OpenAIStream, StreamingTextResponse } from "ai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import OpenAI from "openai";
import { z } from "zod";

export const runtime = "edge";

const chatPostBodySchema = z.object({
  messages: z.array(z.unknown()).default([]),
});

export async function POST(req: Request) {
  const keyParse = z.string().min(1).safeParse(process.env.OPENAI_API_KEY);
  if (!keyParse.success) {
    return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not configured." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  const apiKey = keyParse.data;

  const openai = new OpenAI({ apiKey });

  const bodyUnknown = await req.json().catch(() => null);
  const parsed = chatPostBodySchema.safeParse(bodyUnknown);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid request body.", details: parsed.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const { messages: rawMessages } = parsed.data;
  const userMessages = rawMessages as ChatCompletionMessageParam[];

  // Messages
  console.log(userMessages);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. You give travel advice and recommendations to users. You only care about giving people authentic cultural experiences",
      },
      ...userMessages,
    ],
  });

  // Create a stream of data from OpenAI

  const stream = OpenAIStream(response);

  // Send the stream as a response to the client
  return new StreamingTextResponse(stream);
}

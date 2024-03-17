// Route Handlers
import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set the runtime to edge for best performance

export const runtime = "edge";

// POST
export async function POST(req: Request) {
  const { messages } = await req.json();

  // Messages
  console.log(messages);

  // Create chat completion
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. You give travel advice and recommendations to users. You only care about giving people authentic cultural experiences",
      },
      ...messages,
    ],
  });

  // Create a stream of data from OpenAI

  const stream = OpenAIStream(response);

  // Send the stream as a response to the client
  return new StreamingTextResponse(stream);
}

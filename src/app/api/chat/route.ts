// Route Handlers
import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

// POST

export async function POST(request: Request) {
  const { messages } = await request.json();

  // Messages
  console.log(messages);

  // GPT-4 system message

  // Create chat completion
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. You give travel advice and recommendations to users",
      },
      ...messages,
    ],
  });

  // Create a stream of data from OpenAI

  const stream = await OpenAIStream(response);

  // Send the stream as a response to the client
  return new StreamingTextResponse(stream);
}

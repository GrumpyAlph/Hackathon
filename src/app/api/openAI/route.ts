import { NextResponse } from 'next/server';
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { prompt, systemPrompt = '' } = await req.json();

    const token = process.env.GITHUB_TOKEN;

    const client = new OpenAI({
        baseURL: "https://models.inference.ai.azure.com",
        apiKey: token
      });
    
      const response = await client.chat.completions.create({
        messages: [
          { role:"system", content: systemPrompt },
          { role:"user", content: prompt }
        ],
        model: "gpt-4o-mini",
        temperature: 1,
        max_tokens: 4096,
        top_p: 1
      });

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

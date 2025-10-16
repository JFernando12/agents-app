import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  
  const bodyFormatted = {
    name: body.name,
    description: body.description,
    icon: body.icon,
    custom_prompt: body.customPrompt,
    model: body.model,
    temperature: body.temperature,
    top_k: body.topK,
    top_p: body.topP,
    max_tokens: body.maxTokens,
  };

  const response = await fetch(`${process.env.API_URL}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
    body: JSON.stringify(bodyFormatted),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
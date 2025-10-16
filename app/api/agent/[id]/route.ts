import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const body = await request.json();
  const { id } = await params;

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

  const response = await fetch(`${process.env.API_URL}/service/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
    body: JSON.stringify(bodyFormatted),
  });
  
  const data = await response.json();
  return NextResponse.json(data);
}
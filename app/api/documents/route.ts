import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get("serviceId");

  if (!serviceId) {
    return NextResponse.json(
      { error: "Missing serviceId parameter" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `${process.env.API_URL}/documents?service_id=${serviceId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    }
  );
  const data = await response.json();
  console.log("Fetched service data:", data);

  return NextResponse.json(data.documents);
}

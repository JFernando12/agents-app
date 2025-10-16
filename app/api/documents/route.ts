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

  const formattedDocuments = data.documents.map((doc: any) => ({
    id: doc.id,
    name: doc.file_name,
    type: doc.type,
    createdAt: new Date(doc.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
  }));

  return NextResponse.json({ documents: formattedDocuments });
}

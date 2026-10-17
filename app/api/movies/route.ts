
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { Response: "False", Error: "API Key no configurada" },
      { status: 500 }
    );
  }

  const params = request.nextUrl.searchParams;
  const search = params.get("s");
  const id = params.get("i");

  if (!search && !id) {
    return NextResponse.json(
      { Response: "False", Error: "Falta búsqueda o ID" },
      { status: 400 }
    );
  }

  const omdbParams = new URLSearchParams({
    apikey: apiKey,
  });

  if (id) {
    omdbParams.set("i", id);
    omdbParams.set("plot", "full");
  } else if (search) {
    omdbParams.set("s", search);
  }

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?${omdbParams.toString()}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Error al consultar OMDb");
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        Response: "False",
        Error: "No se pudo conectar con OMDb",
      },
      { status: 502 }
    );
  }
}

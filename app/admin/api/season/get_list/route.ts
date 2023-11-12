import { NextResponse } from "next/server";
import client from "@/libs/client/prisma";

export async function POST(req: Request) {
  const json = await req.json();

  const data = await client?.season.findMany({
    where: {
      seriesId: +json.seriesId,
    },
  });

  return NextResponse.json(
    { ok: data ? true : false, data },
    { status: data ? 200 : 404 },
  );
}

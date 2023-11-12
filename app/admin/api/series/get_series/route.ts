import { NextResponse } from "next/server";
import client from "@/libs/client/prisma";

export async function GET(req: Request) {
  const data = await client?.series.findMany();

  return NextResponse.json(
    { ok: data ? true : false, data },
    { status: data ? 200 : 404 },
  );
}

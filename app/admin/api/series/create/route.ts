import { NextResponse } from "next/server";
import client from "@/app/libs/client";
export async function POST(req: Request) {
  const json = await req.json();

  const data = await client?.series
    .create({ data: json })
    .catch((err) => console.log(err));

  return NextResponse.json(
    { ok: data ? true : false, data },
    { status: data ? 200 : 404 },
  );
}

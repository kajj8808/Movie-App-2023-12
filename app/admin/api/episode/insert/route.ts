import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const json = await req.json();

  const data = await client?.episode
    .create({
      data: { ...json },
    })
    .catch(console.log);

  return NextResponse.json(
    { ok: data ? true : false, data },
    { status: data ? 200 : 404 },
  );
}

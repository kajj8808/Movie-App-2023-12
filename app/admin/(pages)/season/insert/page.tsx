import { Series } from "@prisma/client";
import InsertSeason from "./InsertSeason";

interface IData {
  ok: boolean;
  data: Series[];
}

export default async function Page() {
  const { ok, data } = (await (
    await fetch(`${process.env.SERVER_URL}/admin/api/series/get_list`, {
      cache: "no-store",
    })
  ).json()) as IData;
  return <>{ok ? <InsertSeason seriesList={data} /> : "error"}</>;
}

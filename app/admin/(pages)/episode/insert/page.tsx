import { Series } from "@prisma/client";
import InsertEpisode from "./InsertEpisode";

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

  return <>{ok ? <InsertEpisode seriesList={data} /> : "error"}</>;
}

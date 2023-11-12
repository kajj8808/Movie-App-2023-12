"use client";
import { Episode, Season, Series } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "../../components/TextInput";
import SubmitButton from "../../components/SubmitButton";
import { useRecoilState, useRecoilValue } from "recoil";
import { uploadState } from "@libs/client/atom";
import MediaUploader from "../../components/VideoUploader";
import Link from "next/link";

interface ISeasonList {
  ok: boolean;
  data: Season[];
}

export default function InsertEpisode({
  seriesList,
}: {
  seriesList: Series[];
}) {
  const router = useRouter();

  const { handleSubmit, register } = useForm<Episode>();
  const [seasons, setSeasons] = useState<Season[] | null>(null);
  const [loading, setLoading] = useState();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [insertInfo, setInsertInfo] = useState<Episode>();
  const [series, setSeries] = useState<string>("");
  const [uploadInfo, setUploadInfo] = useRecoilState(uploadState);

  async function onValid(formData: Episode) {
    setIsLoading(true);
    setError("");
    setUploadInfo({
      smi: { isUploading: true, id: "" },
      video: { isUploading: true, id: "" },
    });
    setInsertInfo(formData);
  }

  async function onSeriesChange(event: ChangeEvent<HTMLSelectElement>) {
    if (event.target.value) {
      const json = (await (
        await fetch("/admin/api/season/get_list", {
          method: "POST",
          body: JSON.stringify({ seriesId: event.target.value }),
        })
      ).json()) as ISeasonList;

      setSeries(event.target.options[+event.target.selectedIndex].text);
      if (json.ok && json.data[0]) {
        setSeasons(json.data);
      } else {
        setSeasons(() => null);
      }
    }
  }

  useEffect(() => {
    (async () => {
      const { ok, data } = await (
        await fetch("/admin/api/season/get_list", {
          method: "POST",
          body: JSON.stringify({ seriesId: seriesList[0].id }),
        })
      ).json();
      setSeries(seriesList[0].title);
      if (ok) {
        setSeasons(data);
      }
    })();
  }, []);

  useEffect(() => {
    if (uploadInfo.smi.id === "" || uploadInfo.video.id === "" || !insertInfo)
      return;

    (async () => {
      const json = await (
        await fetch("/admin/api/episode/insert", {
          method: "POST",
          body: JSON.stringify({
            ...insertInfo,
            videoId: uploadInfo.video.id + "",
            seasonId: +insertInfo.seasonId,
            runningTime: +insertInfo.runningTime,
            episode: +insertInfo.episode,
            vtt: uploadInfo.smi.id + "",
          }),
        })
      ).json();

      if (json.ok) {
        router.push("/admin");
      } else {
        setIsLoading(false);
        setError("create error");
      }
    })();
  }, [uploadInfo]);

  return (
    <>
      <h1 className="text-center text-2xl font-bold">Insert Episode</h1>
      <form
        onSubmit={handleSubmit(onValid)}
        className="mt-10 flex flex-col gap-5"
      >
        <select
          className="w-80 rounded-2xl px-5 py-3 shadow-xl"
          onChange={onSeriesChange}
        >
          {seriesList.map((series, index) => (
            <option key={series.title} value={series.id} id={series.title}>
              {series.title}
            </option>
          ))}
        </select>

        {seasons ? (
          <>
            <select
              className="w-80 rounded-2xl px-5 py-3 shadow-xl"
              {...register("seasonId", { required: true })}
            >
              {seasons.map((season, index) => (
                <option value={season.id} key={index}>
                  {season.name}
                </option>
              ))}
            </select>
            <TextInput register={register("title", { required: true })} />
            <TextInput register={register("description", { required: true })} />
            <TextInput register={register("runningTime", { required: true })} />
            <TextInput register={register("thumnail", { required: true })} />
            <TextInput register={register("episode", { required: true })} />
            <MediaUploader type="video" />
            <MediaUploader type="smi" />
          </>
        ) : (
          <div></div>
        )}

        <SubmitButton
          isLoading={
            isLoading ||
            uploadInfo.video.isUploading ||
            uploadInfo.smi.isUploading
          }
          error={error}
          disabled={seasons ? false : true}
        />
      </form>
      <div className="mt-10 flex w-96 flex-col rounded-2xl bg-white px-3 py-3">
        <Link href={`https://www.themoviedb.org/search?query=${series}`}>
          {`https://www.themoviedb.org/search?query=${series}`}
        </Link>
      </div>
    </>
  );
}

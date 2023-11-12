"use client";
import { Season, Series } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TextInput from "../../components/TextInput";
import SubmitButton from "../../components/SubmitButton";

export default function InsertSeason({ seriesList }: { seriesList: Series[] }) {
  const router = useRouter();

  const { handleSubmit, register } = useForm<Season>();
  const [loading, setLoading] = useState();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onValid({ seriesId, name }: Season) {
    setIsLoading(true);
    setError("");
    const json = await (
      await fetch("/admin/api/season/insert", {
        method: "POST",
        body: JSON.stringify({ seriesId: +seriesId, name }),
      })
    ).json();
    if (json.ok) {
      router.push("/admin");
    } else {
      setIsLoading(false);
      setError("create error");
    }
  }

  return (
    <>
      <h1 className="text-center text-2xl font-bold">Insert Season</h1>
      <form
        onSubmit={handleSubmit(onValid)}
        className="mt-10 flex flex-col gap-5"
      >
        <select
          className="w-80 rounded-2xl px-5 py-3 shadow-xl"
          {...register("seriesId")}
        >
          {seriesList.map((series, index) => (
            <option key={index} value={series.id}>
              {series.title}
            </option>
          ))}
        </select>
        <TextInput register={register("name", { required: true })} />
        <SubmitButton isLoading={isLoading} error={error} />
      </form>
    </>
  );
}

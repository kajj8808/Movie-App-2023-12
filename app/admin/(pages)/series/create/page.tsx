"use client";

import { Series } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TextInput from "../../components/TextInput";
import SubmitButton from "../../components/SubmitButton";

export default function CreateSeries() {
  const router = useRouter();

  const { handleSubmit, register } = useForm<Series>();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onValid(formData: Series) {
    setIsLoading(true);
    setError("");
    const json = await (
      await fetch("/admin/api/series/create", {
        method: "POST",
        body: JSON.stringify({ ...formData }),
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
      <h1 className="text-center text-2xl font-bold">Create Series</h1>
      <form
        onSubmit={handleSubmit(onValid)}
        className="mt-10 flex flex-col gap-5"
      >
        <TextInput register={register("title", { required: true })} />
        <TextInput register={register("description", { required: true })} />
        <TextInput register={register("thumbnail", { required: true })} />
        <TextInput register={register("coverImage", { required: true })} />
        <SubmitButton isLoading={isLoading} error={error} />
      </form>
      <div className="mt-10 flex w-96 flex-col rounded-2xl bg-white px-3 py-3">
        <span>https://www.themoviedb.org/</span>
        <span>https://drive.google.com/drive/</span>
        <span>https://drive.google.com/uc?export=view&id=</span>
      </div>
    </>
  );
}

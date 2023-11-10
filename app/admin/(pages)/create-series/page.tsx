"use client";
import client from "@/app/libs/client";

import { Series } from "@prisma/client";
import { useForm } from "react-hook-form";
import Input from "../components/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateSeries() {
  const router = useRouter();

  const { handleSubmit, register } = useForm<Series>();
  const [error, setError] = useState();

  async function onValid(formData: Series) {
    const json = await (
      await fetch("/admin/api/create_series", {
        method: "POST",
        body: JSON.stringify({ ...formData }),
      })
    ).json();
    console.log(json);
    if (json.ok) {
      router.push("/admin");
    } else {
      setError(json.data);
    }
  }

  return (
    <>
      <h1 className="text-center text-2xl font-bold">Create Series</h1>
      <form
        onSubmit={handleSubmit(onValid)}
        className="mt-10 flex flex-col gap-5"
      >
        <Input type="text" register={register("title", { required: true })} />
        <Input
          type="text"
          register={register("description", { required: true })}
        />
        <Input
          type="text"
          register={register("thumbnail", { required: true })}
        />
        <Input
          type="text"
          register={register("coverImage", { required: true })}
        />
        <Input type="submit" />
        <span className="mt-1">{error}</span>
      </form>
      <div className="mt-10 flex w-96 flex-col rounded-2xl bg-white px-3 py-3">
        <span>https://www.themoviedb.org/</span>
        <span>https://drive.google.com/drive/</span>
        <span>https://drive.google.com/uc?export=view&id=</span>
      </div>
    </>
  );
}

import { Series } from "@prisma/client";
import { UseFormRegisterReturn, useForm } from "react-hook-form";

function TextInput({ register }: { register?: UseFormRegisterReturn }) {
  return (
    <input
      type="text"
      placeholder={register!.name}
      className="w-80 rounded-2xl px-4 py-3 shadow-xl"
      {...register}
    />
  );
}

export default TextInput;

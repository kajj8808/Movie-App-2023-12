import { Series } from "@prisma/client";
import { UseFormRegisterReturn, useForm } from "react-hook-form";

function Input({
  register,
  type,
}: {
  register?: UseFormRegisterReturn;
  type: "submit" | "text";
}) {
  return type === "text" ? (
    <input
      type="text"
      placeholder={register!.name}
      className="w-80 rounded-2xl px-4 py-3 shadow-xl"
      {...register}
    />
  ) : (
    <input
      type="submit"
      value="Submit"
      className="w-80 rounded-2xl bg-orange-400 px-4 py-3 font-bold text-white shadow-xl"
    />
  );
}

export default Input;
